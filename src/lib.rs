use std::env::Args;
use std::error::Error;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;
use std::path::PathBuf;
use std::sync::Arc;
use std::thread::{spawn, JoinHandle};

mod error;

use error::ExpReadingsToEnglishError;

static ROOT_STR: &'static str = "F:\\google_drive\\master-thesis-gasification\\Experiments";

type NullResult = Result<(), Box<Error>>;

pub struct Config {
    pub exp_path_string: Arc<String>,
}

impl Config {
    pub fn new(args: Args) -> Result<Config, String> {
        let mut args = args.into_iter();
        args.next();

        let exp_path = match args.next() {
            Some(arg) => {
                let path: PathBuf = [ROOT_STR, &arg].iter().collect();

                if !path.exists() {
                    return Err(format!(
                        "Experiment directory does not exist: {}",
                        path.display()
                    ));
                };

                match path.into_os_string().into_string() {
                    Ok(val) => val,
                    Err(e) => {
                        return Err(format!("Invalid experiment directory: {:?}", e));
                    }
                }
            }

            _ => {
                return Err("Experiment directory not specified!".to_string());
            }
        };

        Ok(Config {
            exp_path_string: Arc::new(exp_path),
        })
    }
}

fn commas_to_dots(exp_path_string: &str, filename: &str) -> NullResult {
    let file_path_buf: PathBuf = [exp_path_string, filename].iter().collect();
    let mut contents = String::new();
    let source_file = File::open(&file_path_buf)?;
    let mut buf_reader = BufReader::new(source_file);
    buf_reader.read_to_string(&mut contents)?;

    let mut dest_path_buf: PathBuf = [exp_path_string, filename].iter().collect();

    dest_path_buf.set_extension("txt1");
    let mut dest_file = File::create(&dest_path_buf)?;
    let contents = contents.replace(",", ".");
    dest_file.write_all(contents.as_bytes())?;

    Ok(())
}

pub fn exp_readings_to_english(
    exp_path_string: Arc<String>,
) -> Result<(), ExpReadingsToEnglishError> {
    let mut handles: Vec<JoinHandle<Result<(), String>>> = Vec::with_capacity(3);

    for name in [
        "EndressHauserLOG4.TXT",
        "Gewichtslog4.TXT",
        "SynthesegasLOG4.TXT",
    ].iter()
    {
        let exp_path_string_ = Arc::clone(&exp_path_string);
        let handle = spawn(move || match commas_to_dots(&exp_path_string_, &name) {
            Ok(_) => Ok(()),
            Err(e) => {
                let error_description = e.description();
                Err(String::from(error_description))
            }
        });

        handles.push(handle);
    }

    let mut errors: Vec<String> = Vec::new();

    for handle in handles {
        match handle.join() {
            Ok(Err(e)) => errors.push(e),
            Ok(_) => (),
            Err(_e) => errors.push(String::from("Thread error")),
        }
    }

    match errors.len() {
        0 => Ok(()),
        _ => Err(ExpReadingsToEnglishError::new(errors)),
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

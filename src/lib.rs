use std::env::Args;
use std::error::Error;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;
use std::path::PathBuf;

static ROOT_STR: &'static str = "F:\\google_drive\\master-thesis-gasification\\Experiments";

pub struct Config {
    pub exp_path_string: String,
}

impl Config {
    pub fn new(args: Args) -> Result<Config, String> {
        let mut args = args.into_iter();
        args.next();

        let exp_path_string = match args.next() {
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

        Ok(Config { exp_path_string })
    }
}

fn commas_to_dots(exp_path_string: &str, filename: &str) -> Result<(), Box<Error>> {
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

pub fn exp_readings_to_english(exp_path_string: &str) -> Result<(), Box<Error>> {
    for name in [
        "EndressHauserLOG4.TXT",
        "Gewichtslog4.TXT",
        "SynthesegasLOG4.TXT",
    ].iter()
    {
        if let Err(e) = commas_to_dots(exp_path_string, name) {
            return Err(e);
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

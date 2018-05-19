#![feature(use_extern_macros)]
extern crate failure;

#[macro_use]
extern crate structopt;

use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;
use std::path::PathBuf;
use std::sync::Arc;
use std::thread::{spawn, JoinHandle};

pub mod config_args;

type IdentityResult = Result<(), failure::Error>;

pub fn exp_readings_to_english(exp_path_string: Arc<String>) -> IdentityResult {
    let mut handles: Vec<JoinHandle<IdentityResult>> = Vec::with_capacity(3);

    for name in [
        "EndressHauserLOG4.TXT",
        "Gewichtslog4.TXT",
        "SynthesegasLOG4.TXT",
    ].iter()
    {
        let exp_path_string_ = Arc::clone(&exp_path_string);
        let handle = spawn(move || commas_to_dots(&exp_path_string_, &name));

        handles.push(handle);
    }

    let mut errors: Vec<failure::Error> = Vec::new();

    for handle in handles {
        match handle.join() {
            Ok(Err(e)) => errors.push(e),
            Ok(_) => (),
            Err(e) => errors.push(failure::format_err!("{:?}", e)),
        }
    }

    match errors.len() {
        0 => Ok(()),
        _ => Err(failure::format_err!("{:?}", errors)),
    }
}

fn commas_to_dots(exp_path_string: &str, filename: &str) -> IdentityResult {
    let file_path_buf: PathBuf = [exp_path_string, filename].iter().collect();
    let mut contents = String::new();
    let source_file = File::open(&file_path_buf)?;
    let mut buf_reader = BufReader::new(source_file);
    buf_reader.read_to_string(&mut contents)?;

    let mut dest_path: PathBuf = [exp_path_string, filename].iter().collect();
    dest_path.set_extension("txt1");

    let mut dest_file = File::create(&dest_path)?;
    let contents = contents.replace(",", ".");
    dest_file.write_all(contents.as_bytes())?;

    Ok(())
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

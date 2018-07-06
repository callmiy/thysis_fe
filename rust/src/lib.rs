#![feature(use_extern_macros)]
extern crate failure;

#[macro_use]
extern crate structopt;

use std::io::prelude::*;
use std::io::BufReader;
use std::path::PathBuf;
use std::thread::{spawn, JoinHandle};
use std::{fs, fs::File};

pub mod config_args;

type VecPathBufResult = Result<Vec<PathBuf>, failure::Error>;
type PathBufResult = Result<PathBuf, failure::Error>;

pub fn exp_readings_to_english(exp_path_string: String) -> VecPathBufResult {
    let mut handles: Vec<JoinHandle<PathBufResult>> = Vec::with_capacity(3);

    for path in get_exp_files(exp_path_string) {
        let handle = spawn(move || commas_to_dots(path));

        handles.push(handle);
    }

    let mut errors: Vec<failure::Error> = Vec::new();
    let mut processed_files: Vec<PathBuf> = Vec::with_capacity(3);

    for handle in handles {
        match handle.join() {
            Ok(processed_file) => match processed_file {
                Ok(file) => processed_files.push(file),
                Err(e) => errors.push(e), //error returned by thread
            },
            Err(e) => errors.push(failure::format_err!("{:?}", e)),
        }
    }

    match errors.len() {
        0 => Ok(processed_files),
        _ => Err(failure::format_err!("{:?}", errors)),
    }
}

fn commas_to_dots(file_path: PathBuf) -> PathBufResult {
    let mut file_path = file_path;
    let mut contents = String::new();
    let source_file = File::open(&file_path)?;
    let mut buf_reader = BufReader::new(source_file);
    buf_reader.read_to_string(&mut contents)?;

    file_path.set_extension("csv");

    let mut dest_file = File::create(&file_path)?;
    let contents = contents.replace(",", ".").replace(";", ",");
    dest_file.write_all(contents.as_bytes())?;

    Ok(file_path)
}

fn get_exp_files(exp_path_string: String) -> Vec<PathBuf> {
    let prefixes = ["EndressHauser", "Gewichts", "Synthesegas"];
    let mut result = Vec::with_capacity(3);

    for entry in fs::read_dir(exp_path_string).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();

        let any = prefixes.iter().any(|prefix| {
            if let Some(filename) = entry.file_name().to_str() {
                return filename.starts_with(prefix);
            };
            false
        });

        if path.is_file() && any {
            result.push(path);
        }
    }

    result
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

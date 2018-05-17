extern crate gasification;

use gasification::Config;
use std::env;
use std::process;

fn main() {
  let config = Config::new(env::args()).unwrap_or_else(|e| {
    eprintln!("{}", e);
    process::exit(1);
  });

  gasification::exp_readings_to_english(&config.exp_path_string).unwrap_or_else(|e| {
    eprintln!("{}", e);
    process::exit(1);
  });

  // println!("{}", config.exp_path_string);
}

extern crate gasification;

use gasification::Config;
use std::env;
use std::process;
use std::sync::Arc;

fn main() {
  let config = Config::new(env::args()).unwrap_or_else(|e| {
    eprintln!("{}", e);
    process::exit(1);
  });

  let exp_path_string = Arc::clone(&config.exp_path_string);

  match gasification::exp_readings_to_english(exp_path_string) {
    Ok(_) => {
      println!("Success");
    }

    Err(e) => {
      eprintln!("{}", e);
      process::exit(1);
    }
  }
}

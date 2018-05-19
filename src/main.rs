extern crate gasification;
extern crate structopt;

use gasification::config_args::{Config, Opt};
use std::sync::Arc;
use structopt::StructOpt;

fn main() {
  let config = Config::new(Opt::from_args()).unwrap_or_else(|e| {
    eprintln!("{}", e);
    std::process::exit(1);
  });

  let exp_path_string = Arc::clone(&config.exp_path_string);

  match gasification::exp_readings_to_english(exp_path_string) {
    Ok(_) => {
      println!("Success");
    }

    Err(e) => {
      eprintln!("{}", e);
      std::process::exit(1);
    }
  }
}

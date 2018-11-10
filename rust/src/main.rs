extern crate thysis;
extern crate structopt;

use thysis::config_args::{Config, Opt};
use structopt::StructOpt;

fn main() {
  let config = Config::new(Opt::from_args()).unwrap_or_else(|e| {
    eprintln!("{}", e);
    std::process::exit(1);
  });

  match thysis::exp_readings_to_english(config.exp_path_string) {
    Ok(processed_files) => {
      println!("\nSuccess:\n{:#?}", processed_files);
    }

    Err(e) => {
      eprintln!("{}", e);
      std::process::exit(1);
    }
  }
}

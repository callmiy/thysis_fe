extern crate structopt;

use std::path::PathBuf;
use std::sync::Arc;

#[derive(Debug, StructOpt)]
#[structopt(name = "gasification experiment")]
pub struct Opt {
  /// Activate debug mode
  #[structopt(short = "d", long = "debug")]
  debug: bool,

  /// The experiment folder to process. If relative path is given, then it is
  /// assumed to be relative to
  /// F:\google_drive\master-thesis-gasification\Experiments
  #[structopt(parse(from_os_str))]
  exp_path_string: PathBuf,
  /*
  /// The experiment folder 1 to process
  #[structopt(short = "p", long = "path")]
  exp_path_string1: Option<String>, //option for optional arguments
  */
}

#[derive(Debug)]
pub struct Config {
  pub exp_path_string: Arc<String>,
}

impl Config {
  pub fn new(args: Opt) -> Result<Config, String> {
    let path = if args.exp_path_string.is_absolute() {
      args.exp_path_string
    } else {
      let mut p = PathBuf::from("F:\\google_drive\\master-thesis-gasification\\Experiments");

      p.push(args.exp_path_string);

      p
    };

    if !path.exists() {
      return Err(format!(
        "Experiment directory does not exist: {}",
        path.display()
      ));
    };

    let exp_path = match path.into_os_string().into_string() {
      Ok(val) => val,
      Err(e) => {
        return Err(format!("Invalid experiment directory: {:?}", e));
      }
    };

    Ok(Config {
      exp_path_string: Arc::new(exp_path),
    })
  }
}

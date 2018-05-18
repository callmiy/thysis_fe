use std::error::Error;
use std::fmt;

#[derive(Debug)]
pub struct ExpReadingsToEnglishError {
  errors: Vec<String>,
}

impl ExpReadingsToEnglishError {
  pub fn new(errors: Vec<String>) -> ExpReadingsToEnglishError {
    ExpReadingsToEnglishError { errors }
  }
}

impl fmt::Display for ExpReadingsToEnglishError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{:?}", self.errors)
  }
}

impl Error for ExpReadingsToEnglishError {
  fn description(&self) -> &str {
    "Error converting readings from ',' to '.' in experiment file"
  }
}

import { SourceFullFrag, AuthorFrag } from "./gen.types";

export type AuthorWithFullName = AuthorFrag & {
  fullName: string;
};

export const authorFullName = (author: AuthorFrag) =>
  [author.lastName, author.firstName, author.middleName]
    .filter(v => !!v)
    .join(" ");

export const authorDisplay = (author: AuthorFrag) => {
  let display = "";

  if (author.firstName) {
    display += author.firstName.charAt(0);
  }

  if (author.middleName) {
    author.middleName.split(" ").forEach(mName => (display += mName.charAt(0)));
  }

  return display ? author.lastName + " " + display : author.lastName;
};

export const sourceDisplay = (source: SourceFullFrag) => {
  let display = source.authors.map(authorDisplay).join(", ") + ".";
  display = display + " | " + source.sourceType.name + " | " + source.topic;

  if (source.publication) {
    display += " | " + source.publication;
  }

  if (source.year) {
    display += " | " + source.year;
  }

  if (source.url) {
    display += " | " + source.url;
  }

  return display;
};

import React from "react";
import { List } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import "./quote-item.css";
import { QuoteFromtagFrag } from "../../graphql/gen.types";
import { makeQuoteURL } from "../../routes/util";
import { makeSourceURL } from "../../routes/util";

type Props = QuoteFromtagFrag;

export class QuoteItem extends React.Component<Props> {
  render() {
    const { id, text, date, source } = this.props;
    return (
      <List.Item key={id} className="quote-item">
        <List.Content>
          <List.Header
            as={NavLink}
            to={makeQuoteURL(id)}
            className="quote-text"
          >
            {text}
          </List.Header>

          {source && (
            <NavLink to={makeSourceURL(source.id)} className="source-display">
              {source.display}
            </NavLink>
          )}

          <List.Description className="quote-date">{date}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

export default (quote: QuoteFromtagFrag, index: number) => (
  <QuoteItem key={quote.id} {...quote} />
);

import gql from "graphql-tag";

export const ALLE_BENUTZER_ENTFERNE_VERANDERUNG = gql`
  mutation AlleBenutzerEntferneVeranderung {
    alleBenutzerEntferne
  }
`;

export default ALLE_BENUTZER_ENTFERNE_VERANDERUNG;

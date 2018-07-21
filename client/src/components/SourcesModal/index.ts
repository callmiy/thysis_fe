import { withRouter } from "react-router-dom";
import { graphql } from "react-apollo";

import SourcesModal from "./component";
import SOURCES_QUERY from "../../graphql/sources-1.query";
import { SourceFrag } from "../../graphql/gen.types";
import { OwnProps } from "./utils";
import { ComponentDataProps } from "./utils";
import { Sources1 as Sources1Query } from "../../graphql/gen.types";

const reshapeSource = (s: SourceFrag | null) => {
  if (!s) {
    return {} as SourceFrag;
  }

  return {
    ...s,
    display: `${s.display} | ${s.sourceType.name}`
  } as SourceFrag;
};

export const reshapeSources = (sources: SourceFrag[] | null): SourceFrag[] => {
  if (!sources) {
    return [] as SourceFrag[];
  }

  return sources.map(reshapeSource);
};

const sourcesGraphQl = graphql<OwnProps, Sources1Query, {}, ComponentDataProps>(
  SOURCES_QUERY,
  {
    props: ({ data }) => {
      if (!data || !data.sources) {
        return data as ComponentDataProps;
      }

      const sources = data.sources as SourceFrag[];
      return {
        ...data,
        sources: reshapeSources(sources)
      } as ComponentDataProps;
    }
  }
);

export default withRouter(sourcesGraphQl(SourcesModal));

import { withRouter } from "react-router-dom";
import { graphql } from "react-apollo";

import SourcesModal from "./component";
import SOURCES_QUERY from "../../graphql/sources-1.query";
import { SourceFullFrag } from "../../graphql/gen.types";
import { sourceDisplay } from "../../graphql/utils";
import { OwnProps } from "./utils";
import { ComponentDataProps } from "./utils";
import { Sources1 as Sources1Query } from "../../graphql/gen.types";

const reshapeSource = (s: SourceFullFrag | null) => {
  if (!s) {
    return {} as SourceFullFrag;
  }

  return {
    ...s,
    display: `${sourceDisplay(s)} | ${s.sourceType.name}`
  } as SourceFullFrag;
};

export const reshapeSources = (
  sources: SourceFullFrag[] | null
): SourceFullFrag[] => {
  if (!sources) {
    return [] as SourceFullFrag[];
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

      const sources = data.sources as SourceFullFrag[];
      return {
        ...data,
        sources: reshapeSources(sources)
      } as ComponentDataProps;
    }
  }
);

export default withRouter(sourcesGraphQl(SourcesModal));

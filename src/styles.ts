import styled, { css } from "styled-components/macro";

export const appColor = "#5faac7;";

export const RouteContainer = styled.div`
  height: 100%;
  overflow: hidden;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const RouteMain = styled.div`
  flex: 1;
  padding: 5px;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const visuallyHidden = css`
  /* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility  */
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
`;

export const redirectToAuthButtonCss = css`
  display: block;
  width: 100%;
  margin-top: 20px;
  text-decoration: none;
  color: #fff !important;
  background-color: ${appColor};
  padding: 8px;
  text-align: center;
  border-radius: 0.3rem;
  font-weight: bolder;
`;

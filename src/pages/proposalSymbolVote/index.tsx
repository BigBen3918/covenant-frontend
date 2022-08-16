import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { EnumProtocolName } from "../../@types/protocol";
import { colors } from "../../common";
import {
  NavBack,
  ProposalCardVaultEmission,
  ProposalCardVaultIncentive,
  ProposalCardVaultReward,
  TimeRemaining,
} from "../../components";

type Props = {};

const ProposalSymbolVote = (props: Props) => {
  const location = useLocation();
  const { symbol } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const isProposer = searchParams.get("proposer") && true;

  if (!location.state) {
    return <></>;
  }

  const navState = location.state as any;

  let { proposal: currentProposal } = navState;

  if (!currentProposal) {
    // TODO: return to homepage
  }

  return (
    <Box className="main-body flex flex-col grow">
      <Box className="flex flex-col main-content gap-14">
        <Box className="flex justify-between">
          <NavBack />
          {isProposer ? (
            <Box className="flex gap-8">
              <Button variant="contained" color="tealLight">
                Copy Link
              </Button>
              <Button variant="contained" color="tealLight">
                IPFS
              </Button>
              <Button variant="contained" color="tealLight">
                Clawback
              </Button>
            </Box>
          ) : (
            <Button variant="contained" color="tealLight">
              Vote
            </Button>
          )}
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box className="flex flex-col gap-12 mt-12">
            <Box className="flex flex-col">
              <Typography variant="h6">Wrapped Matic (Polygon)</Typography>
              <Typography color={colors.textGray}>
                Description about the proposal
              </Typography>
            </Box>
            <Box className="flex flex-col gap-8">
              <ProposalCardVaultIncentive
                proposal={currentProposal}
                isProposer={isProposer}
              />
              <ProposalCardVaultEmission
                proposal={currentProposal}
                isProposer={isProposer}
              />
              <ProposalCardVaultReward
                proposal={currentProposal}
                isProposer={isProposer}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} className="flex !flex-col">
          <TimeRemaining></TimeRemaining>
          <Box className="relative flex flex-auto">
            <Box className="flex flex-col flex-auto gap-2 text-center pt-6 md:text-right md:pt-0 md:absolute md:right-0 md:bottom-0">
              <Link href="#">Go to Snapshot</Link>
              <Link href="#">
                Go to{" "}
                {`${EnumProtocolName[symbol as keyof typeof EnumProtocolName]}`}
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box className="mt-16 mb-32"></Box>
    </Box>
  );
};

export default ProposalSymbolVote;

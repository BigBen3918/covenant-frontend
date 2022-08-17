import { Box, Button, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import classNames from "classnames";
import { useQuery } from "@apollo/client";
import {
    FormTextField,
    FormSelect,
    FormSliderInput,
    FormRangeSliderInput,
} from "../../../../components/form";
import { colors } from "../../../../common";
import { useEffect, useState } from "react";
import { GET_PROPOSAL } from "../../../../gql";
import tokens from "./token.json";
import Action from "../../../../services";

const BoxForm = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
}));

type Props = {
    name: String;
};

interface SnapShotData {
    value: number;
    display: string;
}

// interface snapInterface extends

const ProposalForm = (props: Props) => {
    const [name, setName] = useState("");
    const [time, setTime] = useState("");
    const [snapshot, setSnapshot] = useState<SnapShotData[]>([]);
    const [voteOption, setVoteOption] = useState<SnapShotData[]>([]);
    const [endTime, setEndTime] = useState(0);
    useEffect(() => {
        if (props.name == "qidao") {
            setName("qidao.eth");
        } else if (props.name == "aave") {
            setName("aave.eth");
        }
    }, []);
    const { data, loading, error } = useQuery(GET_PROPOSAL, {
        variables: { name: name },
        pollInterval: 0,
    });

    const ClickSnap = (e: any) => {
        const temp = [] as SnapShotData[];
        for (var i = 0; i < data?.proposals[e].choices.length; i++) {
            temp.push({
                value: i,
                display: data?.proposals[e].choices[i],
            });
            setVoteOption(temp);
        }
        const date = new Date(data?.proposals[e].end * 1000);
        setValue("endTime", (data?.proposals[e].end * 1000).toString());
        timeStyle(date);
    };

    const timeStyle = (date: Date) => {
        const month = myMonth(date);
        const hour = myHour(date);
        const day = date.getDate();
        const year = date.getFullYear();
        const result = month + " " + day + ", " + year + ", " + hour;
        setTime(result);
    };

    const myMonth = (date: Date) => {
        if (date.getMonth() == 0) {
            return "January";
        }
        if (date.getMonth() == 1) {
            return "February";
        }
        if (date.getMonth() == 2) {
            return "March";
        }
        if (date.getMonth() == 3) {
            return "April";
        }
        if (date.getMonth() == 4) {
            return "May";
        }
        if (date.getMonth() == 5) {
            return "June";
        }
        if (date.getMonth() == 6) {
            return "July";
        }
        if (date.getMonth() == 7) {
            return "August";
        }
        if (date.getMonth() == 8) {
            return "September";
        }
        if (date.getMonth() == 9) {
            return "October";
        }
        if (date.getMonth() == 10) {
            return "November";
        }
        if (date.getMonth() == 11) {
            return "December";
        }
    };

    const myHour = (date: Date) => {
        if (date.getHours() < 12) {
            return date.getHours() + " AM";
        } else {
            return date.getHours() - 12 + " PM";
        }
    };

    useEffect(() => {
        const temp = [] as SnapShotData[];
        data?.proposals?.map((i: any, key: number) => {
            temp.push({
                value: key,
                display: i.title,
            });
        });
        setSnapshot(temp);
    }, [data]);

    const navigate = useNavigate();
    const { prsalType, kpi } = useParams();

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            proposalName: "",
            proposalDescription: "",
            snapshotProposal: "",
            desiredVote: "",
            endTime: "",
            gaugeFixed: "",
            rewardCurrency: "",
            minimumBribe: "0",
            loyaltyVote: "",
            minVoteWeightNum: 0,
            minVoteWeightSlide: 0,
            votePercent: [{ value: 10 }],
            votePercentNum: [{ value: 10 }],
            range: [{ value: [0, 10] }],
            rangeNum: [{ value: [0, 10] }],
            payout: "0",
        },
    });

    const {
        fields: votePercentFields,
        append: votePercentAppend,
        remove: votePercentRemove,
    } = useFieldArray({ control, name: "votePercent" });

    const { append: votePercentNumAppend, remove: votePercentNumRemove } =
        useFieldArray({ control, name: "votePercentNum" });

    const { append: rangeAppend, remove: rangeRemove } = useFieldArray({
        control,
        name: "range",
    });

    const { append: rangeNumAppend, remove: rangeNumRemove } = useFieldArray({
        control,
        name: "rangeNum",
    });

    // const { append: payoutAppend, remove: payoutRemove } = useFieldArray({
    //     control,
    //     name: "payout",
    // });

    const onFormSubmit = async (value: any) => {
        // navigate("confirm", {
        //     state: {
        //         myProp: "Hey there",
        //     },
        // });
        const result = await Action.proposal_registry(value, props.name);
        console.log(value);
        if (result) alert("ok");
        else alert("error");
    };

    const isGovernance = prsalType === "governance";
    const isFixed = kpi === "fixed";
    const isVariable = !isGovernance && !isFixed;

    const onAddGaugeVariable = () => {
        votePercentAppend({ value: 0 });
        votePercentNumAppend({ value: 0 });
        rangeAppend({ value: [0, 10] });
        rangeNumAppend({ value: [0, 10] });
        // payoutAppend(0);
    };

    const onDeleteGaugeVariable = (idx?: number | number[]) => {
        votePercentRemove(idx);
        votePercentNumRemove(idx);
        rangeRemove(idx);
        rangeNumRemove(idx);
        // payoutRemove(idx);
    };

    return (
        <Box
            className="flex flex-col gap-8 "
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit(onFormSubmit)}
        >
            <Box className="grid md:grid-cols-3 gap-8">
                <Box className="flex flex-col md:col-span-2 gap-12">
                    <BoxForm className="flex flex-col p-8 md:p-20 rounded-md  gap-8">
                        <FormTextField
                            label="Proposal Name"
                            name="proposalName"
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: "You must enter proposal name.",
                                },
                            }}
                            placeholder="Enter  proposal name here"
                        />
                        <FormTextField
                            label="Proposal Description"
                            name="proposalDescription"
                            rules={{
                                required: {
                                    value: true,
                                    message:
                                        "You must enter proposal description.",
                                },
                            }}
                            control={control}
                        />
                        <FormSelect
                            label="Snapshot Proposal"
                            placeholder="Choose a snashot proposal"
                            items={snapshot}
                            name="snapshotProposal"
                            setVote={ClickSnap}
                            control={control}
                        />
                        {isGovernance && (
                            <FormSelect
                                label="Desired Vote Outcome"
                                placeholder="Choose desired vote outcome"
                                items={voteOption}
                                name="desiredVote"
                                control={control}
                            />
                        )}
                        {isGovernance && (
                            <FormTextField
                                label="Proposal End Time"
                                placeholder="This will be 1 hour before Snapshot ends"
                                name="endTime"
                                control={control}
                                time={time}
                                readonly={true}
                            />
                        )}
                        {!isGovernance && isFixed && (
                            <FormSelect
                                label="Select Gauge"
                                placeholder="Choose gauge"
                                items={voteOption}
                                name="gaugeFixed"
                                control={control}
                            />
                        )}
                        <FormSelect
                            label="Reward Currency"
                            placeholder="Choose your reward currency"
                            items={tokens}
                            name="rewardCurrency"
                            control={control}
                        />
                        {!isGovernance && (
                            <FormTextField
                                label="Minimum Bribe"
                                name="minimumBribe"
                                helpText="Enter minimum bribe value if applicable"
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message:
                                            "You must enter minimum proposal.",
                                    },
                                }}
                                placeholder="Enter minimum bribe amount if applicable"
                            />
                        )}
                    </BoxForm>
                    <BoxForm className="flex flex-col p-8 md:p-20 rounded-md gap-8">
                        {votePercentFields.map((vp, idx) => (
                            <Box
                                key={vp.id}
                                className={classNames(
                                    "flex flex-col gap-8",
                                    isVariable &&
                                        "bg-[#121415] rounded pt-6 pb-12"
                                )}
                            >
                                {isVariable && (
                                    <Box className="flex justify-between px-6">
                                        <Typography
                                            variant="subtitle1"
                                            color={colors.textGray}
                                        >{`Section ${idx + 1}`}</Typography>
                                        {votePercentFields.length > 1 && (
                                            <IconButton
                                                aria-label="delte section"
                                                className="!bg-red-500 text-white"
                                                onClick={() =>
                                                    onDeleteGaugeVariable(idx)
                                                }
                                            >
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        )}
                                    </Box>
                                )}
                                <Box
                                    className={classNames(
                                        "flex flex-col gap-8",
                                        isVariable && "px-12"
                                    )}
                                >
                                    {!isGovernance && (
                                        <FormSliderInput
                                            label="Vote %"
                                            helpText="Select the vote% per which payment would be made, eg: 1%"
                                            name={`votePercent[${idx}].value`}
                                            inputName={`votePercentNum[${idx}].value`}
                                            index={idx}
                                            control={control}
                                            setValue={setValue}
                                            valueLabelFormat={(value: number) =>
                                                `${value}%`
                                            }
                                            isArray
                                        />
                                    )}
                                    <FormTextField
                                        label="Payout"
                                        name="payout"
                                        control={control}
                                        index={idx}
                                        placeholder={
                                            isGovernance
                                                ? "Amount that will be paid out if vote concludes with desired outcome"
                                                : "Enter payout in reward currency per vote percent selected above"
                                        }
                                    />
                                    {isGovernance ? (
                                        <Box className="flex gap-4">
                                            <FormSliderInput
                                                label="Minimum Vote Weight"
                                                helpText="mention the minimum vote weight that the user has to vote with in order to be eligible for the bribe"
                                                name="minVoteWeightSlide"
                                                inputName="minVoteWeightNum"
                                                index={idx}
                                                control={control}
                                                setValue={setValue}
                                                isArray
                                            />
                                        </Box>
                                    ) : (
                                        <FormRangeSliderInput
                                            label="Range"
                                            name={`range[${idx}].value`}
                                            inputName={`rangeNum[${idx}].value`}
                                            index={idx}
                                            setValue={setValue}
                                            control={control}
                                            helpText="Select the range that you want to incentivise. The upper range would be considered the target vote. Open ended bribes require an upper range of 100%"
                                        />
                                    )}
                                </Box>
                            </Box>
                        ))}
                        {!isGovernance && !isFixed && (
                            <Box className="flex justify-end">
                                <Button
                                    variant="contained"
                                    color="tealLight"
                                    type="button"
                                    onClick={onAddGaugeVariable}
                                >
                                    Add
                                </Button>
                            </Box>
                        )}
                        {!isGovernance && (
                            <FormSelect
                                label="Sticky Vote"
                                name="loyaltyVote"
                                helpText="Select the number of consecutive vote cycles that need to be be voted for to receive the reward"
                                control={control}
                                placeholder="Number of vote cylces to give payout. Max 4 cylces"
                                items={[
                                    { value: 1, display: "1" },
                                    { value: 2, display: "2" },
                                    { value: 3, display: "3" },
                                    { value: 4, display: "4" },
                                ]}
                            />
                        )}
                    </BoxForm>
                    <Box className="mb-10 md:mb-20 flex justify-end"></Box>
                </Box>
                <Box>
                    <BoxForm className="flex flex-col p-8 md:p-12 rounded-md gap-8 mb-12 md:mb-0">
                        <Typography>Total proposal value</Typography>
                        <Box className="flex flex-col gap-8">
                            <Box className="grid grid-cols-3 gap-8">
                                <Typography className="col-span-2">
                                    $/vote
                                </Typography>
                                <Typography className="text-right">
                                    $0.01
                                </Typography>
                                <Typography className="col-span-2">
                                    Total Incentive
                                </Typography>
                                <Typography className="text-right">
                                    $100k
                                    <br />
                                    100k Mai
                                </Typography>
                                <Typography className="col-span-2">
                                    Max Reward
                                </Typography>
                                <Typography className="text-right">
                                    100k Mai
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            color="tealLight"
                            type="submit"
                        >
                            Continue
                        </Button>
                    </BoxForm>
                </Box>
            </Box>
        </Box>
    );
};

export { ProposalForm };

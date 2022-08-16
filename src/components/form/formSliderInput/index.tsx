import {
  FormControl,
  StyledEngineProvider,
  Box,
  Slider,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputProps } from "../formInputProps";
import { FormLabel } from "../formLabel";

interface Props extends FormInputProps {
  valueLabelFormat?: (value: number, index: number) => string;
  inputName: string;
  isArray?: boolean;
}

const FormSliderInput = ({
  label,
  name,
  inputName,
  control,
  rules,
  index,
  helpText,
  valueLabelFormat,
  setValue,
  isArray,
}: Props) => {
  return (
    <StyledEngineProvider injectFirst>
      <FormControl className="flex flex-row flex-auto items-center gap-4">
        <FormLabel label={label} helpText={helpText} />
        <Box className="basis-9/12 flex">
          <Box className="basis-9/12 flex items-center">
            <Controller
              name={name}
              control={control}
              render={({
                field: { onChange, value: fieldValue, ref },
                formState,
              }) => {
                let slideVal = Number(fieldValue);
                return (
                  <Slider
                    getAriaLabel={() => "Default"}
                    ref={ref}
                    value={slideVal}
                    onChange={(e, changeVal) => {
                      let finalVal = 0;
                      if (Array.isArray(changeVal)) {
                        finalVal = changeVal[0];
                      } else {
                        finalVal = changeVal;
                      }
                      setValue(inputName, finalVal);
                      onChange(changeVal);
                    }}
                    valueLabelDisplay="auto"
                    valueLabelFormat={valueLabelFormat}
                  />
                );
              }}
            />
          </Box>
          <Box className="basis-1/12"></Box>
          <Box className="basis-2/12">
            <Controller
              name={inputName}
              control={control}
              render={({
                field: { onChange, value: fieldValue, ref },
                fieldState: { error },
                formState,
              }) => {
                let txtValue = fieldValue;
                return (
                  <TextField
                    ref={ref}
                    helperText={error ? error.message : null}
                    error={!!error}
                    type="number"
                    InputProps={{
                      inputProps: { min: 0, max: 100, maxLength: 3 },
                    }}
                    onChange={e => {
                      setValue(name, Number(e.target.value));
                      onChange(e.target.value);
                    }}
                    value={txtValue}
                    fullWidth
                  />
                );
              }}
            />
          </Box>
        </Box>
      </FormControl>
    </StyledEngineProvider>
  );
};

FormSliderInput.defaultProps = {
  label: "",
  placeholder: "",
  isArray: false,
};

export { FormSliderInput };

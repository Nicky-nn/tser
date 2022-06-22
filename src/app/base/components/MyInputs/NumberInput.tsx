import {forwardRef} from "react";
import NumberFormat, {InputAttributes} from "react-number-format";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

export const numberWithCommas = (x: number | undefined, {userTyping, input}: any) => {
    if (userTyping) {
        return input;
    }
    const options = {
        minimumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
};

export const NumberFormatCustom = forwardRef<NumberFormat<InputAttributes>,
    CustomProps>(function NumberFormatCustom(props, ref) {
    const {onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            decimalScale={2}
            thousandSeparator
            isNumericString
        />
    );
});
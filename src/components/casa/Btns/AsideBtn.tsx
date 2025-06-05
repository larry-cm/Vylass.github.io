import { Button, Checkbox } from "@material-tailwind/react";
interface Props {
    text: string;
    id: string;
    to?: string;
    button?: boolean;
    children?: React.ReactNode
}

const AsideBtn: React.FC<Props> = ({ text, id, to, button, children }) => {
    if (button) {
        return (
            <Button id={id} type="button" variant="outline">
                {children && children} <span className="ms-2"> {text}</span>
            </Button >
        );
    } else {
        return (
            <Checkbox id={id}>
                <Checkbox.Indicator />
            </Checkbox>
        );
    }
};

export default AsideBtn;

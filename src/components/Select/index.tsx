import { OptionFolderComponent } from "@/components/Select/folderOption";
import { OptionKeyComponent } from "@/components/Select/keyOption";
import { GroupBase, Props, Select, SelectInstance } from "chakra-react-select";
import { RefAttributes } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";

type ControlledSelectProps<T extends FieldValues, Option = unknown, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> = UseControllerProps<T> & Props<Option, IsMulti, Group> & RefAttributes<SelectInstance<Option, IsMulti, Group>>;

export default function ControlledSelect<T extends FieldValues, Option = unknown, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>({
    control,
    name,
    rules,
    ...props
}: ControlledSelectProps<T, Option, IsMulti, Group>) {
    const {
        field: { onChange, onBlur, value, ref },
    } = useController<T>({
        name,
        control,
        rules
    });

    return (
        <Select<Option, IsMulti, Group>
            name={name}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            {...props}
        />
    );
};

export { OptionKeyComponent, OptionFolderComponent }
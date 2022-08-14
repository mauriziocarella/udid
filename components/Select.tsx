import classNames from 'classnames';
import React from 'react';
import ReactSelect, {
	components, ControlProps,
	GroupBase, IndicatorsContainerProps, IndicatorSeparatorProps,
	InputProps, MenuListProps, MenuProps,
	MultiValueGenericProps, MultiValueRemoveProps,
	OptionProps, PlaceholderProps,
	Props, SingleValueProps,
	ValueContainerProps
} from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import {NoticeProps} from 'react-select/dist/declarations/src/components/Menu';
import {Checkbox} from './Checkbox';

export type SelectOption<T> = {
	readonly value: T;
	readonly label: number | string;
}

const styleProxy = new Proxy({}, {
	get: () => () => {}
});

const Control = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: ControlProps<Option, IsMulti, Group>) => (
	<components.Control {...props} className="flex-1 flex items-center flex-wrap sm:text-sm shadow-sm rounded-md bg-white relative min-w-[200px] min-h-[2.5rem] border border-gray-300 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"/>
);
const Input = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: InputProps<Option, IsMulti, Group>) => (
	<components.Input {...props} className="inline-grid flex-auto col-start-1 col-end-3 row-start-1 row-end-2 grid-cols-[0_min-content] m-0 !ml-0" inputClassName="!min-h-0 focus:ring-0 !min-w-[100px] !my-2"/>
);
const Placeholder = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: PlaceholderProps<Option, IsMulti, Group>) => (
	<components.Placeholder {...props} innerProps={{...props.innerProps, className: 'absolute text-gray-500 col-start-1 col-end-3 row-start-1 row-end-2'}}/>
);
const MultiValueContainer = <Option, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: MultiValueGenericProps<Option, true, Group>) => (
	<components.MultiValueContainer {...props} innerProps={{...props.innerProps, className: 'inline-flex flex-row border rounded shadow-sm px-2 py-1 mr-2 my-2'}}/>
);
const ValueContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: ValueContainerProps<Option, IsMulti, Group>) => (
	<components.ValueContainer {...props} innerProps={{...props.innerProps, className: 'relative flex flex-row flex-wrap flex-1 items-center overflow-hidden px-2'}}/>
);
const SingleValue = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: SingleValueProps<Option, IsMulti, Group>) => (
	<components.SingleValue {...props} innerProps={{...props.innerProps, className: 'truncate col-start-1 col-end-3 row-start-1 row-end-2'}}/>
);
const IndicatorsContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({children, ...props}: IndicatorsContainerProps<Option, IsMulti, Group>) => (
	<components.IndicatorsContainer {...props} innerProps={{...props.innerProps, className: 'group flex flex-row items-center shrink-0 self-stretch px-2'}}>
		{(children as Array<any>).map((el, index) => {
			if (!el) return null;

			return React.cloneElement(el, {
				key: index,
				className: 'px-1 cursor-pointer flex items-center text-gray-300 hover:text-gray-800 group-focus:text-gray-800'
			});
		})}
	</components.IndicatorsContainer>
);
const IndicatorSeparator = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: IndicatorSeparatorProps<Option, IsMulti, Group>) => (
	<components.IndicatorSeparator {...props} className="w-px my-1 mx-1 self-stretch bg-gray-200"/>
);
const Menu = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: MenuProps<Option, IsMulti, Group>) => (
	<components.Menu {...props} innerProps={{...props.innerProps, className: 'absolute z-10 w-full top-full mt-0.5'}}/>
);
const MenuList = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: MenuListProps<Option, IsMulti, Group>) => (
	<components.MenuList {...props} className="bg-white rounded shadow-sm text-sm" />
);
const MenuOption = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: OptionProps<Option, IsMulti, Group>) => (
	<components.Option
		{...props}
		className={classNames(
			'group px-4 py-2 first:rounded-t last:rounded-b border not-last:border-b-0 border-gray-300 cursor-pointer transition-all font-medium',
			props.isFocused && 'bg-secondary text-secondary-content',
			props.isSelected && 'bg-primary text-primary-content',
			'hover:bg-primary hover:text-primary-content hover:border-gray-300 hover:border-l'
		)}
	>
		{props.children || props.label}
	</components.Option>
);
const MenuMultiOption = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: OptionProps<Option, IsMulti, Group>) => (
	<MenuOption {...props}>
		<Checkbox
			checked={props.isSelected}
			className="mr-2"
		/>
		<label className="cursor-pointer">{props.label}</label>
	</MenuOption>
);
const MultiValueRemove = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: MultiValueRemoveProps<Option, IsMulti, Group>) => (
	<components.MultiValueRemove {...props} innerProps={{...props.innerProps, className: '-my-1 -mr-2 ml-1 p-1 transition-all rounded bg-error hover:bg-error-focus text-error-content'}}/>
);
const NoOptionsMessage = <Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>({...props}: NoticeProps<Option, IsMulti, Group>) => (
	<components.NoOptionsMessage {...props} innerProps={{...props.innerProps, className: 'text-muted text-center py-2'}}/>
);

type BaseSelectProps<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> = Props<Option, IsMulti, Group>
function BaseSelect<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>({components, className, ...props}: BaseSelectProps<Option, IsMulti, Group>) {
	return (
		<ReactSelect
			styles={styleProxy}
			className={classNames('relative flex flex-row items-center', className)}
			placeholder="Select..."
			// menuIsOpen={true}
			components={{
				Input,
				Control,
				ValueContainer,
				SingleValue,
				IndicatorsContainer,
				IndicatorSeparator,
				Placeholder,
				Menu,
				MenuList,
				MultiValueRemove,
				NoOptionsMessage,
				Option: MenuOption,
				...components,
			}}
			{...props}
			// value={typeof props.value === 'undefined' && typeof props.options !== 'undefined' ? props.options.find((option) => (option as Option).value === props.selected) : props.value}
		/>
	);
}

type CreatableSelectProps<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> = Props<Option, IsMulti, Group>
function CreatableSelect<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>({components, className, ...props}: CreatableSelectProps<Option, IsMulti, Group>) {
	return (
		<ReactCreatableSelect
			styles={styleProxy}
			className={classNames('relative flex flex-row items-center', className)}
			placeholder="Select..."
			components={{
				Input,
				Control,
				ValueContainer,
				SingleValue,
				IndicatorsContainer,
				IndicatorSeparator,
				Placeholder,
				Menu,
				MenuList,
				MultiValueRemove,
				NoOptionsMessage,
				Option: MenuOption,
				...components,
			}}
			{...props}
			// value={typeof props.value === 'undefined' && typeof props.options !== 'undefined' ? props.options.find((option) => (option as Option).value === props.selected) : props.value}
		/>
	);
}

type MultiSelectProps<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> = BaseSelectProps<Option, IsMulti, Group> & {
	isCreatable?: boolean;
}
export const MultiSelect = <
	Option,
	Group extends GroupBase<Option> = GroupBase<Option>
>({...props}: MultiSelectProps<Option, true, Group>) => {
	if (props.isCreatable) {
		return (
			<CreatableSelect
				isMulti
				closeMenuOnSelect={false}
				hideSelectedOptions={false}
				components={{
					MultiValueContainer,
					Option: MenuMultiOption,
				}}
				{...props}
			/>
		);
	}

	return (
		<BaseSelect
			isMulti
			closeMenuOnSelect={false}
			hideSelectedOptions={false}
			components={{
				MultiValueContainer,
				Option: MenuMultiOption,
			}}
			{...props}
		/>
	);
};

type SelectProps<Option, Group extends GroupBase<Option> = GroupBase<Option>> = BaseSelectProps<Option, false, Group> & {
	isCreatable?: boolean;
}
export const Select = <
	Option,
	Group extends GroupBase<Option> = GroupBase<Option>
	>({...props}: SelectProps<Option, Group>) => {
	if (props.isCreatable) {
		return (
			<CreatableSelect
				{...props}
			/>
		);
	}

	return (
		<BaseSelect
			{...props}
		/>
	);
};

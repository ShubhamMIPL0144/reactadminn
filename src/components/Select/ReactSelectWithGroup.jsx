import { useState } from "react";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";

const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#eee";
  if (isActive) bg = "#B2D4FF";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex"
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      {children}
    </components.Option>
  );
};

const ReactSelect = ({ options, setSelectedOption }) => {
  const { auth } = useSelector((state) => state.auth);
  const { id } = auth.data;

  const allAdsOption = { value: "all_ads", label: "All Ads" };
  const clientAdsOption = { value: "client_ads", label: "All Ad Creators Ads" };
  const adminAdsOption = { value: id, label: "Admin Ads" };

  const groupedOptions = [
    {
      label: "Ad Creators List",
      options: options.filter(option => option.value !== "admin_ads" && option.value !== "client_ads")
    }
  ];

  const extendedOptions = [
    allAdsOption,
    adminAdsOption,
    clientAdsOption,
    ...groupedOptions
  ];

  return (
    <Select
      defaultValue={[]}
      closeMenuOnSelect={true}
      hideSelectedOptions={false}
      onChange={(selectedOption) => {
        setSelectedOption(selectedOption);
      }}
      options={extendedOptions}
      components={{
        Option: InputOption
      }}
    />
  );
};

export default ReactSelect;

import React from "react";

// @ts-ignore
function ToggleSwitch({ onChange }) {
  return (
    <>
      <label className="switch">
        <input onChange={onChange} type="checkbox" />
        <span className="slider round"></span>
      </label>
    </>
  );
}
export default ToggleSwitch;

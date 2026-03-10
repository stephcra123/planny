import styled from 'styled-components'

const StyledLabel = styled.label`
  margin-right: 0.25rem;
`
const StyledInput = styled.input`
  padding: 0.4rem 0.5rem;
`
function TextInputWithLabel({
  elementId,
  label,
  onChange,
  ref,
  value,
}) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel
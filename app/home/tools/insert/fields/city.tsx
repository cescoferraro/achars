import * as React from "react"
import { SelectField } from "redux-form-material-ui"
import { Field } from "redux-form"
import { states } from "../../../../../shared/states"
import MenuItem from "material-ui/MenuItem"
import { eachItem } from "../../../../../shared/mix"

const eachCity = (state) => (state.children.map(eachItem))
const isCurrentState = (uf) =>
    (state) => (state.code === uf)

export const FormCity = ({ formState }) => {
    const uf = formState.myForm === undefined ? 0 :
        formState.myForm.values.address.uf
    return (
        <Field
            name="address.city"
            floatingLabelText="CIdade"
            component={SelectField}
            fullWidth={true}
            hintText="Select a plan"
        >
            <MenuItem value={0} primaryText="Todas Cidades" />
            {states.filter(isCurrentState(uf)).map(eachCity)}
        </Field>
    )
}

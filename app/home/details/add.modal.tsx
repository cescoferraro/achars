import * as React from "react"
import * as detailsCSS from "./css/details.pcss"
import { AddGeneral } from "./components/general";
import { AddCategories } from "./components/categories";
import { AddPhones } from "./components/phones";
import { AddImageDetail } from "./components/images";
import withStyles from "isomorphic-style-loader/lib/withStyles"
import { MyHelmet } from "../../../shared/mix";

export const AddModal = withStyles(detailsCSS)(({ history, match, location }) => {
    const back = (e) => {
        e.stopPropagation()
        history.goBack()
    }
    const add = location.state.add
    const groups = location.state.groups
    return (
        <div onClick={back} className={detailsCSS.container} >
            <MyHelmet title={match.params.id} />
            <div className={detailsCSS.modal} >
                <AddGeneral add={add} />
                <AddCategories groups={groups} add={add} />
                <AddPhones add={add} />
                <AddImageDetail add={add} />
                <button
                    onClick={back}
                    type="button"
                >
                    Close </button>
            </div>
        </div>
    )
}
)
/* <Card className={addCSS.add} key={Math.random()}>*/
/* </Card>*/

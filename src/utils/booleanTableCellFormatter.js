import {Check, X} from "react-bootstrap-icons";


export const booleanTableCellFormatter = (cell, row) => {
    return cell ? ( 
        <div style={{ height: "1rem" }}>
            <Check color="#008495" size={22} />
            <div style={{ opacity: "0", height: "1rem", top: "-1.5rem", position: "relative" }}>V</div>
        </div> 
    ) : ( 
        <div style={{ height: "1rem" }}>
            <X color="#CB2334" size={22}/>
            <div style={{ opacity: "0", height: "1rem", top: "-1.5rem", position: "relative" }}>X</div>
        </div> 
    )   
}
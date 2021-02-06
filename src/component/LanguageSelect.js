import React from "react";
import i18next from "i18next";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { useState } from "react";


const languages = [    
    { name: "PL", value: "pl" },
    { name: "EN", value: "en" }
];

const LanguageSelect = () => {
    const [radioValue, setRadioValue] = useState("1");

    return(
        <div>
            <ButtonGroup toggle>
                {languages.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        type="radio"
                        variant="secondary"
                        name="radio"
                        size="sm"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) => {
                            setRadioValue(e.currentTarget.value);
                            i18next.changeLanguage(e.currentTarget.value);
                            console.log(e.currentTarget.value);
                        }}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </div>
    )
}

export default LanguageSelect;
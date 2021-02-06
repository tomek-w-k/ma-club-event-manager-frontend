import React from "react";
import { useDropzone } from "react-dropzone";

const ClubDocumentDropzone = ({ onDrop, accept, fileName, dropzoneText }) => {	
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept });

	const divStyle = {
		textAlign: "center", 
		backgroundColor: "gainsboro"		
	};

	return (
		<div {...getRootProps()}> 
			<input  {...getInputProps()} />
			<div style={divStyle}>
				{isDragActive ? (
					fileName ? (<div>{fileName}</div> ) : ( <div>{dropzoneText}</div> )
				) : ( 						
					fileName ? (<div>{fileName}</div> ) : ( <div>{dropzoneText}</div> )
                )}
			</div>
		</div>
	);
};

export default ClubDocumentDropzone;
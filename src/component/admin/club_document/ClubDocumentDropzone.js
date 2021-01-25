import React from "react";
import { useDropzone } from "react-dropzone";

const ClubDocumentDropzone = ({ onDrop, accept, fileName }) => {	
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
					fileName ? (<div>{fileName}</div> ) : ( <div>Click to load a document or drag it here</div> )
				) : ( 						
                    fileName ? (<div>{fileName}</div> ) : ( <div>Click to load a document or drag it here</div> )
                )}
			</div>
		</div>
	);
};

export default ClubDocumentDropzone;
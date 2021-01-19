import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop, accept, imagePath }) => {	
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept });

	return (
		<div {...getRootProps()}> 
			<input  {...getInputProps()} />
			<div style={{textAlign: "center", backgroundColor: "gainsboro"}}>
				{isDragActive ? (
					<p  style={{color: "black"}} >Release to drop the files here</p>
				) : ( 						
                    <img 
                        src={imagePath} 
                        alt="Drag 'n' drop some files here, or click to select files" 
                        style={{color: "black", maxWidth: "800px", maxHeight: "600px"}}							
                    />
                )}
			</div>
		</div>
	);
};

export default Dropzone;
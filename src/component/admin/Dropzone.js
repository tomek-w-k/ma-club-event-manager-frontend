import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop, accept, imagePath, mw, mh }) => {	
	//const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept });

	const dropzoneStyle = {
		color: "black",
		maxWidth: mw,
		maxHeight: mh
	};

	const divStyle = {
		textAlign: "center", 
		backgroundColor: "gainsboro"		
	};

	return (
		// <div {...getRootProps()}> 
		// 	<input  {...getInputProps()} />
			<div style={divStyle}>
				{/* {isDragActive ? (
					imagePath ? 
						(<img 
							src={imagePath} 
							alt="Drag 'n' drop some files here, or click to select files" 
							style={dropzoneStyle}
						/>) : ( <p  style={{color: "black"}} >Release to drop the files here</p> )
				) : ( 						 */}
                    <img 
                        src={imagePath} 
                        alt="Drag 'n' drop some files here, or click to select files" 
                        style={dropzoneStyle}
                    />
                {/* )} */}
			</div>
		// </div>
	);
};

export default Dropzone;
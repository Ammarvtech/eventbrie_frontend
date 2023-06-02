import React from "react"
import style from "@/styles/scss/app.module.scss"

const TermsContent = (props: any) => {
	const { content } = props;
	return (
		<>
			<div className={style.blk}>
				{content}
			</div>
		</>
	)
}

export default TermsContent

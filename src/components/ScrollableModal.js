import { useEffect } from 'react'
import styled from 'styled-components'

const Background = styled.div`
	position: fixed;
	background-color: rgba(0, 0, 0, 0.7);
	inset: 0px;
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	overflow: auto;
	//z-index: 2;
	box-sizing: border-box;
	text-align: center;
	vertical-align: middle;
`

const Scroller = styled.div`
	position: relative;
	//z-index: 3;
	outline: none;
	max-width: 90%;
	width: ${p => (p.contentWidth ? p.contentWidth : '30rem')};
	margin: 20px auto;
	vertical-align: middle;
	display: inline-block;
	height: max-content;
`

const Content = styled.div`
	text-align: left;
	background: white;
	width: 100%;
	gap: 20px;
	display: flex;
	flex-direction: column;
`

const ScrollableModal = ({ children, closeModal, contentWidth = null, zIndex = 2 }) => {
	useEffect(() => {
		document.documentElement.style.overflow = 'hidden'
		return () => {
			document.documentElement.style.overflow = 'unset'
		}
	}, [])
	return (
		<Background onMouseDown={closeModal} style={{ zIndex: zIndex }}>
			<Scroller contentWidth={contentWidth} style={{ zIndex: zIndex + 1 }}>
				<Content className="rounded-lg sm:rounded-2xl " onMouseDown={e => e.stopPropagation()}>
					{children}
				</Content>
			</Scroller>
		</Background>
	)
}

export default ScrollableModal

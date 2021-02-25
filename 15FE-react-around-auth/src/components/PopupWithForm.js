import React from 'react';

export function PopupWithForm(props) {
    return(
    <>
        <div className={'overlay' + (props.isOpen && props.name.startsWith('credentials') ? ' overlay_remove' : ' overlay')}></div>

        <section className={`modal modal_${props.name}` + (props.isOpen ? ' modal_visible' : '')}>
            <div className="modal__container">
                <button className={`modal__close modal__close_${props.name}` + (props.name.startsWith('credentials') ? ' modal__close_removed' : ' modal__close')} onClick={props.onClose}></button>
                <div className={`modal__background modal__background_${props.name}`}>
                    <form action="#" className={`modal__form modal__form_${props.name}`} noValidate onSubmit={props.onSubmit}>
                        <h3 className={`modal__title modal__title_${props.name}`}>{props.title}</h3>
                        {props.children}
                        <button className={`modal__save-btn modal__save-btn_${props.name}` + (!props.name.startsWith('tooltip') ? ' modal__save-btn' : ' modal__save-btn_removed')} type="submit" >{props.text}</button> 
                    </form>
                </div>
            </div>
        </section>
    </>
    )
}
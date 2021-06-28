import React from "react"
import styles from '../../stylesheets/other/Modal.module.css'

interface ModalProps {
  changeValue?: React.Dispatch<React.SetStateAction<string>>,
  setValue: Function,
  toAlter?: string,
  toggleModal: Function,
}

function Modal({ changeValue, setValue, toAlter, toggleModal }: ModalProps) {
  return (
    <form className={styles['modal-form']}>
      {
        (function renderModalTitle() {
          switch (true) {
            case (!toAlter):
              return (
                <h1 className={styles['modal-title']}>
                  Create new notebook&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </h1>
              );
            case (!changeValue):
              return (
                <h1 className={styles['modal-title']}>
                  Are you sure you'd like to delete this notebook?&nbsp;
                </h1>
              );
            default:
              return (
                <h1 className={styles['modal-title']}>
                  Edit notebook name&nbsp;&nbsp;&nbsp;&nbsp;
                </h1>
              );
          }
        })()
      }
      {
        changeValue &&
        <input type='text' placeholder='Name' name='name' onChange={e => changeValue(e.target.value)} />
      }
      <div className={styles['modal-buttons']}>
        <span>
          <button className={styles['cancel-button']} onClick={e => toggleModal(e)}>
            Cancel
          </button>
          &nbsp;&nbsp;&nbsp;
          {
            !toAlter &&
            <button className={styles['continue-button']} onClick={e => setValue(e)}>
              Continue
            </button>
          }
          {
            toAlter &&
            <button className={styles['continue-button']} onClick={e => setValue(e, toAlter)}>
              Continue
            </button>
          }
        </span>
      </div>
    </form>
  );
}

export default Modal

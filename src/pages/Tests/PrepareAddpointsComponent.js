import React, { useState } from 'react';
import { AccordionBody, AccordionHeader, AccordionItem, Card, CardBody, Label, UncontrolledAccordion } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export const AddCkEditorPoints = ({ label, setFieldValue, name, data }) => {
    return (
        <>
            <Label className="col-form-label">{label}</Label>
            <CKEditor
                editor={ClassicEditor}
                data={data}
                onReady={(editor) => {}}
                onChange={(event, editor) => {
                    //    setData(editor.getData());
                    setFieldValue(name, editor.getData());
                }}
            />
        </>
    );
};

export const FaqsComponent = ({
    label,
    holder,
    setFieldValue,
    name,
    data,
    title,
    nomessage,
    quesHolder,
    ansHolder,
    isDeleteable,
    values
}) => {
    const [show, setShow] = useState(false);
    const [questionValue, setQuestionValue] = useState('');
    const [ansWerValue, setAnswerValue] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!questionValue || !ansWerValue) {
            setError('Values should not empty.');
            return;
        }
        setFieldValue(name, [...data, { question: questionValue, answer: ansWerValue }]);
        setQuestionValue('');
        setAnswerValue('');
        setShow(false);
    };

    const handleDelete = (value, idx) => {
        setFieldValue(
            name,
            values[name].filter((_, index) => index !== idx)
        );
    };

    return (
        <Card className="box-shadow-card">
            <CardBody>
                <Label className="col-form-label">
                    {label}
                    <button
                        type="button"
                        className="btn btn-soft-primary btn-sm me-2 ms-2 rounded-pill sm-btn"
                        onClick={() => setShow(true)}
                        title={title}
                    >
                        <i className="ri-add-fill fs-18 fw-bold"></i>
                    </button>
                </Label>
                {show && (
                    <Card>
                        <CardBody className="d-flex justify-content-between flex-column">
                            <InputComponent
                                id="questionValue"
                                type="text"
                                name={name}
                                className="input-default w-100 mb-2"
                                placeholder={quesHolder}
                                value={questionValue}
                                invalid={!!error && !questionValue}
                                onChange={(e) => {
                                    setQuestionValue(e.target.value);
                                    setError('');
                                }}
                                autoFocus
                            />
                            <InputComponent
                                id="questionValue"
                                type="ansWerValue"
                                name={'ansWerValue'}
                                className="input-default w-100 mb-2"
                                placeholder={ansHolder}
                                value={ansWerValue}
                                invalid={!!error && !ansWerValue}
                                onChange={(e) => {
                                    setAnswerValue(e.target.value);
                                    setError('');
                                }}
                            />
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    id="medsSave"
                                    onClick={handleSave}
                                >
                                    Add
                                </button>
                            </div>
                        </CardBody>
                    </Card>
                )}
                {data?.length > 0 ? (
                    <UncontrolledAccordion defaultOpen={['form0', 'form1', 'form2']} stayOpen className="my-2">
                        {data?.map((item, idx) => (
                            <AccordionItem key={idx}>
                                <AccordionHeader targetId={idx}>
                                    {item.question}
                                    {isDeleteable && (
                                        <i
                                            className="ri-delete-bin-line align-middle ms-3 cursor-pointer text-primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item, idx);
                                            }}
                                        ></i>
                                    )}
                                </AccordionHeader>
                                <AccordionBody accordionId={idx}>{item.answer}</AccordionBody>
                            </AccordionItem>
                        ))}
                    </UncontrolledAccordion>
                ) : (
                    !show && <p className="mb-0 ms-2 mt-2">{nomessage}</p>
                )}
            </CardBody>
        </Card>
    );
};

export const PrepareAddpoints = ({ label, holder, setFieldValue, name, data, title, nomessage, isDeleteable, values }) => {
    const [show, setShow] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!inputValue) {
            setError('Value should not empty.');
            return;
        }
        setFieldValue(name, [...data, inputValue]);
        setInputValue('');
        setShow(false);
    };
    const handleDelete = (value, idx) => {
        setFieldValue(
            name,
            values[name].filter((_, index) => index !== idx)
        );
    };
    return (
        <Card className="box-shadow-card">
            <CardBody>
                <Label className="col-form-label">
                    {label}
                    <button
                        type="button"
                        className="btn btn-soft-primary btn-sm me-2 ms-2 rounded-pill sm-btn"
                        onClick={() => setShow(true)}
                        title={title}
                    >
                        <i className="ri-add-fill fs-18 fw-bold"></i>
                    </button>
                </Label>
                {show && (
                    <Card>
                        <CardBody className="d-flex align-items-center justify-content-between">
                            <InputComponent
                                id="testAmount"
                                type="text"
                                name="testAmount"
                                className="input-default w-90"
                                placeholder={holder}
                                value={inputValue}
                                invalid={!!error}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setError('');
                                }}
                                autoFocus
                            />
                            <button
                                type="button"
                                className="btn btn-md btn-primary "
                                data-bs-dismiss="modal"
                                id="medsSave"
                                onClick={handleSave}
                            >
                                Add
                            </button>
                        </CardBody>
                    </Card>
                )}
                {data?.length > 0 ? (
                    <ul className="mb-0 mt-2">
                        {data?.map((i, idx) => (
                            <li className="mb-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    {i}
                                    {isDeleteable && (
                                        <i
                                            className="ri-delete-bin-line align-middle ms-3 cursor-pointer text-primary"
                                            onClick={(e) => {
                                                handleDelete(i, idx);
                                            }}
                                        ></i>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mb-0 ms-2 mt-2">{nomessage}</p>
                )}
            </CardBody>
        </Card>
    );
};

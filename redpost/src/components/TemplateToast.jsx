import { CToast, CToastHeader, CToastBody } from '@coreui/react';

const TemplateToast = ( type, color, message ) => {
    return (
        <CToast autohide={true} color={color} delay={5000} key={Date.now()}>
            <CToastHeader closeButton>
                <svg
                className="rounded me-2"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
                >
                <rect
                    width="100%"
                    height="100%"
                    // fill={type === 'error' ? '#e85454' : '#29d93e'}
                    fill={
                        type === 'success' ? '#29d93e' : 
                        type === 'info' ? '#6799FF' :
                        type === 'warning' ? '#FFBB00' :
                        type === 'error' || type === 'failed' ? '#e85454' :
                        '#e85454'}
                />
                </svg>
                <strong className="me-auto">{type.toUpperCase()}</strong>
            </CToastHeader>
            <CToastBody style={{ backgroundColor: "white"}}>{message}</CToastBody>
        </CToast>
    );
}

export default TemplateToast;
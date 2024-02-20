import styled from "@emotion/styled";

const Boton = styled.button`
    display: block;
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid #d1d1d1;
    padding: .8rem 2rem;
    margin: 2rem auto; 
    text-align: center;
    background-color: ${(props: {bgColor: string}) => props.bgColor === 'true' ? '#DA552F' : 'white'};
    color: ${props => props.bgColor === 'true' ? 'white' : '#000'};

    &:last-of-type {
        margin-right:0;
    }

    &:hover {
        cursor: pointer;
    }
`;

export default Boton;
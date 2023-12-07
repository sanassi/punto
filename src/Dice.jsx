import "./Dice.css";

const Pip = () => <span className="pip" />;

const Face = ({ children }) => <div className="face">{children}</div>;

const Dice = ({ face }) => {
    let pips = Number.isInteger(face)
        ? Array(face)
            .fill(0)
            .map((_, i) => <Pip key={i} />)
        : null;
    return <Face>{pips}</Face>;
};

export default Dice;

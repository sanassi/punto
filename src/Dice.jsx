import "./Dice.css";

const Pip = (color) => <span className="pip" style={{backgroundColor: color.color }} />;

const Face = ({ children }) => <div className="face">{children}</div>;

const Dice = ({ face, visible, color }) => {
    let pips = Number.isInteger(face)
        ? Array(face)
            .fill(0)
            .map((_, i) => <Pip key={i} color={color} />)
        : null;
    return <div className="dice" style={{ visibility: visible ? "visible" : "hidden" }}>
        <Face>{pips}</Face>
    </div>;
};

export default Dice;

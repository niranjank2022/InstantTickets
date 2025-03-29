export default function SearchBar() {
  return (
    <>
      <div className="input-group">
        <span className="input-group-text">
          <i className="fas fa-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search Movies ..."
        >
        </input>
      </div>
    </>
  );
}

let Database = function () {
    let $ = Object.create (null);

    // getAllFields - traverses an array of objects to produce an object that contains all
    // the field names, and all the associated values of each field
    let getAllFields = function (database) {
        let allFields = {};
        for (let record of database) {
            let fields = Object.keys (record).sort ();
            for (let field of fields) {
                // make sure there is a field collector
                if (!(field in allFields)) {
                    allFields[field] = Object.create (null);
                }

                // put the value in, all the individual values if it's an array
                let values = record[field];
                if (values instanceof Array) {
                    for (let value of values) {
                        allFields[field][value] = value;
                    }
                } else {
                    allFields[field][values] = values;
                }
            }
        }

        // now replace each entry with a sorted array of its keys, and then save it
        let fields = Object.keys (allFields);
        for (let field of fields) {
            allFields[field] = Object.keys (allFields[field]).sort ();
        }
        return allFields;
    };

    //------------------------------------------------------------------------------------
    // Source is an interface declaration for something that returns a database
    $.Source = function () {
        let _ = Object.create (null);

        _.init = function (database) {
            this.database = database;
            return this;
        };

        _.getDatabase = function () {
            return this.database;
        };

        _.new = function (database) {
            let newObject = Object.create (_);
            return newObject.init (database);
        };

        return _;
    } ();

    //------------------------------------------------------------------------------------
    // database filter element is a single part of a deep tree query, they are grouped
    // together to build complex AND-based reduction operations
    $.FilterElement = function () {
        let _ = Object.create (null);

        let doFilter = function (database, filterField, filterValue) {
            let result = [];

            // if the search key is not specified, this is a pass-through filter, just return
            // what we started with
            if (filterField.length === 0) {
                return database;
            }

            // the individual filter function
            let conditionedFilterValue = filterValue.toLowerCase ();
            let matchValue = function (value) {
                // XXX would be really interesting to see about using characters like
                // XXX '^' and '$' to indicate beginning and end of string
                let matchIndex = value.toString ().toLowerCase ().indexOf (conditionedFilterValue);
                return (matchIndex >= 0);
            };

            // otherwise, loop over all the records to see what passes
            for (let record of database) {
                // only pass records that contain the search key
                let match = (filterField in record);
                if (match === true) {
                    // get the value from the record, it might be a value, or an array of
                    // values, so we have to check and handle accordingly
                    let values = record[filterField];
                    if (values instanceof Array) {
                        let anyMatches = false;
                        for (let value of values) {
                            anyMatches = anyMatches || matchValue (value);
                        }
                        match = match && anyMatches;
                    } else {
                        match = match && matchValue (values);
                    }
                }

                // if we match, store the record into the result
                if (match == true) {
                    result.push (record);
                }
            }

            // return the result
            return result;
        };

        let makeSelect = function (id, keys, value) {
            let optionsHTML = "";
            if (keys.length > 1) {
                let ghost = "PICK ONE";
                optionsHTML = block ("option", { "value": "" }, ghost);
            }
            for (let key of keys) {
                //let encodedName = encodeURIComponent (key).toLowerCase ();
                //let selectedAttr = (encodedName == value) ? " selected" : "";
                let attributes = { "value": key };
                if (key === value) {
                    attributes.selected = "selected";
                }
                optionsHTML += block ("option", attributes, key);
            }

            let innerHTML = block ("select", {
                "class": "filterElementListContainer",
                "id": id,
                //"disabled":"disabled",
                "onchange": "theFilter.onValueChange (this);"
            }, optionsHTML);
            return innerHTML;
        };

        let makeControls = function (index, fieldKeys) {
            let innerHTML =
                div ("filterElementDiv", makeSelect ("filterElementSelectKey" + index, fieldKeys, ""))
                + div ("filterElementDiv", block ("input", {
                    "class": "filterElementTextbox",
                    "type": "text",
                    "id": "filterElementTextbox" + index,
                    "onkeypress": "if (event.keyCode == 13) { theFilter.onEnterKey (this) };",
                    "oninput": "theFilter.onValueChange (this);",
                    //"disabled": "disabled",
                    "value": ""
                }, ""))
                + div ("filterElementDiv", makeSelect ("filterElementSelectValue" + index, [], ""))
                + block ("div", {
                    "id": "filterElementCountDiv" + index,
                    "class": "filterElementCountDiv"
                }, "");

            return innerHTML;
        };

        _.init = function (index, fieldKeys, databaseSource, owner) {
            this.index = index;
            this.databaseSource = databaseSource;
            this.owner = owner;
            this.filterField = "";
            this.filterValue = "";

            // create the select and editing elements inside the supplied div id
            document.getElementById ("filterElementContainer" + index).innerHTML = makeControls (index, fieldKeys);
        };

        _.update = function () {
            let database = this.databaseSource.getDatabase ();
            let filterField = this.filterField;
            let filterValue = this.filterValue;
            let index = this.index;

            // rebuild the value select
            let allFields = getAllFields (this.databaseSource.getDatabase ());
            let selectParentDiv = document.getElementById ("filterElementSelectValue" + index).parentElement;
            selectParentDiv.innerHTML = makeSelect ("filterElementSelectValue" + index, (filterField in allFields) ? allFields[filterField] : [], filterValue);

            this.filteredDatabase = doFilter (database, filterField, filterValue);
            document.getElementById ("filterElementCountDiv" + index).innerHTML = this.filteredDatabase.length + "/" + database.length;
            this.owner.push (this.index);
        };

        _.onValueChange = function (updatedControl) {
            switch (updatedControl.id.replace (/\d+$/, "")) {
                case "filterElementSelectKey": {
                    // key - clear textbox and selectvalue
                    this.setFilterField (updatedControl.value);
                    break;
                }
                case "filterElementTextbox": {
                    // textbox - update selectvalue
                    document.getElementById ("filterElementSelectValue" + this.index).value = updatedControl.value;
                    this.setFilterValue (updatedControl.value);
                    break;
                }
                case "filterElementSelectValue": {
                    document.getElementById ("filterElementTextbox" + this.index).value = updatedControl.value;
                    this.setFilterValue (updatedControl.value);
                    break;
                }
            }
        };

        _.onEnterKey = function (updatedControl) {

        };

        _.getDatabase = function () {
            return this.filteredDatabase;
        };

        _.setFilterField = function (filterField) {
            this.filterField = filterField;
            this.filterValue = "";
            document.getElementById ("filterElementTextbox" + this.index).value = "";

            this.update ();
        };

        _.setFilterValue = function (filterValue) {
            this.filterValue = filterValue;
            this.update ();
        };

        _.new = function (id, fieldKeys, databaseSource, owner) {
            let newObject = Object.create (_);
            newObject.init (id, fieldKeys, databaseSource, owner);
            return newObject;
        };

        return _;
    } ();

    //------------------------------------------------------------------------------------
    $.Filter = function () {
        let _ = Object.create (null);

        _.init = function (database, elementCount, onUpdate) {
            this.databaseSource = Database.Source.new (database);
            this.elementCount = elementCount;
            this.onUpdate = onUpdate;
            this.fieldKeys = Object.keys (getAllFields (database)).sort ();
            return this.reset ();
        };

        _.push = function (index) {
            let filters = this.filters;
            let length = filters.length;
            if ((index + 1) < length) {
                filters[index + 1].update ();
            } else {
                // this was the last one, reverse up the list looking for the last full filter
                while ((filters[index].filterField.length == 0) && (index > 0)) {
                    --index;
                }
                if (filters[index].filterField.length > 0) {
                    ++index;
                }
                if (index < length) {
                    document.getElementById ("filterElementContainer" + index).style.visibility = "visible";
                    while (++index < length) {
                        document.getElementById ("filterElementContainer" + index).style.visibility = "hidden";
                    }
                }

                // and finally call the outbound onUpdate
                this.onUpdate (this.getDatabase ());
            }
            return this;
        };

        _.update = function () {
            return this.push (-1);
        };

        _.onValueChange = function (updatedControl) {
            let index = updatedControl.id.match (/\d+$/)[0];
            this.filters[index].onValueChange (updatedControl);
        };

        _.onEnterKey = function (updatedControl) {
            let index = updatedControl.id.match (/\d+$/)[0];
            this.filters[index].onEnterKey (updatedControl);

        };

        _.getDatabase = function () {
            return this.filters[this.filters.length - 1].getDatabase ();
        };

        _.reset = function () {
            // create the select and editing elements, starting with the clear button
            let filterArrayContainerHTML = block ("button", {
                "class": "filterClearButton",
                "type": "button",
                "onclick": "theFilter.reset ();"
            }, "CLEAR");

            for (let index = 0; index < this.elementCount; ++index) {
                filterArrayContainerHTML += block ("div", {
                    "class": "filterElementContainer",
                    "id": "filterElementContainer" + index
                }, "");
            }
            document.getElementById ("filterContainer").innerHTML = filterArrayContainerHTML;

            this.filters = [];
            for (let index = 0; index < this.elementCount; ++index) {
                this.filters.push (Database.FilterElement.new (index, this.fieldKeys, (index > 0) ? this.filters[index - 1] : this.databaseSource, this));
            }

            return this.update ();
        };

        _.new = function (database, elementCount, onUpdate) {
            return Object.create (_).init (database, elementCount, onUpdate);
        };

        return _;
    } ();

    return $;
} ();


// I'd like a better way to do this than exposing a global variable - is it possible to
// make the whole thing re-entrant?
let theFilter;
let makeFilter = function (db, elementCount, onUpdate) {
    theFilter = Database.Filter.new (db, elementCount, onUpdate);
};

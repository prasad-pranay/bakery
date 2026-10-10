from bson import ObjectId
from datetime import datetime, date

def serialize_doc(doc):
    """
    Recursively converts MongoDB BSON documents into JSON-serializable dictionaries,
    converting ObjectId to string and datetime objects to ISO strings.
    Maintains exact _id string fields expected by Mongoose frontend models.
    """
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        res = {}
        for k, v in doc.items():
            if isinstance(v, ObjectId):
                res[k] = str(v)
            elif isinstance(v, (datetime, date)):
                res[k] = v.isoformat()
            elif isinstance(v, (dict, list)):
                res[k] = serialize_doc(v)
            else:
                res[k] = v
        return res
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, (datetime, date)):
        return doc.isoformat()
    return doc

def to_object_id(val):
    if val is None:
        return None
    if isinstance(val, ObjectId):
        return val
    try:
        return ObjectId(str(val))
    except Exception:
        return None

from datetime import datetime
from bson import ObjectId
from app.db import get_db
from app.utils.serializers import serialize_doc, to_object_id

def get_or_create_conversation(user_id: str):
    db = get_db()
    uid = to_object_id(user_id)
    conversation = db.conversations.find_one({
        'userId': uid,
        'status': 'open'
    })
    if not conversation:
        now = datetime.utcnow()
        new_conv = {
            'userId': uid,
            'assignedTo': None,
            'status': 'open',
            'createdAt': now,
            'updatedAt': now
        }
        res = db.conversations.insert_one(new_conv)
        new_conv['_id'] = res.inserted_id
        conversation = new_conv
    return conversation

def save_user_message(conversation_id: str, user_id: str, text: str):
    db = get_db()
    cid = to_object_id(conversation_id)
    now = datetime.utcnow()
    msg = {
        'conversationId': cid,
        'senderId': user_id,
        'senderType': 'user',
        'message': text.strip(),
        'createdAt': now,
        'updatedAt': now
    }
    res = db.messages.insert_one(msg)
    msg['_id'] = res.inserted_id
    # Also touch updatedAt on conversation
    db.conversations.update_one({'_id': cid}, {'$set': {'updatedAt': now}})
    return serialize_doc(msg)

def save_support_message(conversation_id: str, text: str):
    db = get_db()
    cid = to_object_id(conversation_id)
    now = datetime.utcnow()
    # Touch updatedAt so conversation floats to the top of admin dashboards
    db.conversations.update_one({'_id': cid}, {'$set': {'updatedAt': now}})
    msg = {
        'conversationId': cid,
        'senderId': 'admin',
        'senderType': 'support',
        'message': text.strip(),
        'createdAt': now,
        'updatedAt': now
    }
    res = db.messages.insert_one(msg)
    msg['_id'] = res.inserted_id
    return serialize_doc(msg)

def get_conversation_history(conversation_id: str):
    db = get_db()
    cid = to_object_id(conversation_id)
    messages = list(db.messages.find({'conversationId': cid}).sort('createdAt', 1))
    return serialize_doc(messages)

def get_all_open_conversations():
    db = get_db()
    pipeline = [
        {'$match': {'status': 'open'}},
        {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        },
        {
            '$addFields': {
                'userId': {
                    '$let': {
                        'vars': {'u': {'$arrayElemAt': ['$user', 0]}},
                        'in': {
                            '_id': '$$u._id',
                            'name': '$$u.name',
                            'email': '$$u.email'
                        }
                    }
                }
            }
        },
        {'$project': {'user': 0}},
        {'$sort': {'updatedAt': -1}}
    ]
    convs = list(db.conversations.aggregate(pipeline))
    return serialize_doc(convs)

def get_all_conversations():
    db = get_db()
    pipeline = [
        {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        },
        {
            '$addFields': {
                'userId': {
                    '$let': {
                        'vars': {'u': {'$arrayElemAt': ['$user', 0]}},
                        'in': {
                            '_id': '$$u._id',
                            'name': '$$u.name',
                            'email': '$$u.email'
                        }
                    }
                }
            }
        },
        {'$project': {'user': 0}},
        {'$sort': {'updatedAt': -1}}
    ]
    convs = list(db.conversations.aggregate(pipeline))
    return serialize_doc(convs)

def verify_conversation_owner(conversation_id: str, user_id: str) -> bool:
    db = get_db()
    cid = to_object_id(conversation_id)
    conv = db.conversations.find_one({'_id': cid})
    if not conv:
        return False
    return str(conv.get('userId')) == str(user_id)

def close_conversation(conversation_id: str):
    db = get_db()
    cid = to_object_id(conversation_id)
    db.conversations.update_one({'_id': cid}, {'$set': {'status': 'closed'}})

getAllOpenConversations = get_all_open_conversations
getAllConversations = get_all_conversations

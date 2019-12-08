const fs = require("fs");
const path = require("path");
const XmlStream = require('xml-stream')
const helpers = require('./sql/helpers.js');

var stream = fs.createReadStream(path.join(__dirname, '/data/ULAN4.xml'));
var xml = new XmlStream(stream);

xml.preserve('Subject', true);

let count = 0; 
let rej_count = 0; 
let data = [];

xml.on('endElement: Subject', function(subject) {
    
    let children = subject['$children'];
    let subject_id = subject['$'].Subject_ID; 
    let obj = {
        id: subject_id
    }

    for (let child of children) {
        let has_bio = child['Preferred_Biography'] && child['Preferred_Biography']['Biography_Text'] 
            && child['Preferred_Biography']['Biography_Text']['$text'];

        if (has_bio) {
            obj.bio = child['Preferred_Biography']['Biography_Text']['$text'];

            continue;
        }

        let has_note = child['Descriptive_Note'] && child['Descriptive_Note']['Note_Text'] 
            && child['Descriptive_Note']['Note_Text']['$text'];

        if (has_note) {
            obj.note = child['Descriptive_Note']['Note_Text']['$text'];

            continue; 
        }

        let has_role = child['Preferred_Role'] && child['Preferred_Role']['$children'];

        if (has_role) {
            let roleArr = child['Preferred_Role']['$children'].map((role, i) => {
                return role['$text'];
            }).filter((role) => {
                return role && role != 'N/A' && !role.includes('unidentified'); 
            });

            roleArr = roleArr.map((role, i) => {
                if (role.includes('/')) {
                    return role.split('/')[1];
                } else {
                    return role;
                }
            });

            obj.role = roleArr.join();

            continue; 
        }

        let has_name = child['Preferred_Term'] && child['Preferred_Term']['$children'];

        if (has_name) {
            let nameArr = child['Preferred_Term']['$children'].filter((name) => {
                return name && name['$text']; 
            }).map((name, i) => {
                return name['$text'].trim();
            }).filter((name) => {
                return name && name !== '' && name !== 'N/A'; 
            });

            obj.name = nameArr.join();

            continue; 
        }
    }

    if (obj.name && obj.bio && obj.note && obj.role !== undefined) {
        try {
            let id = `"${obj.id}"`;
            let name = `"${obj.name}"`;
            let bio = obj.bio ? `"${obj.bio}"` : 'NULL';
            let note = obj.note ? `"${obj.note}"` : 'NULL';
            let role = obj.role ? `"${obj.role}"` : 'NULL';

            data.push([id, name, bio, note, role]);

            console.log('wrote object', count);
            count++;
        } catch (e) {
            console.log('did not write object', rej_count);
            rej_count++;
        }
        
    }
});

xml.on('end', async function() {
    await helpers.bulk_add_verified_ulan_artist(data);
    console.log('writing ended, added', count, data.length);
});
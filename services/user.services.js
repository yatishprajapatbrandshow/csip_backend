const bcrypt = require('bcrypt');
const pool = require('../connection'); // Use pool instead of a single connection
const moment = require('moment');

// generateSlug
const generateSlug = async (input) => {
    input = input.trim();
    let slug = input.replace(/[^a-zA-Z0-9]/g, '-');
    slug = slug.toLowerCase();
    return slug;
}

// generateRandomNumber
const generateRandomNumber = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const randomNumber = Math.floor(Math.random() * 10000);
    const formattedRandomNumber = randomNumber.toString().padStart(4, '0');
    const uniqueId = `${month}${formattedRandomNumber}${day}`;
    return Number(uniqueId);
}

// insert Data
const insertData = async (data) => {
    const connection = await pool.getConnection();
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        await connection.beginTransaction();

        const insertRegistrationQuery = `
            INSERT INTO registrations (sid, name, email, password, mobile,dob, gender,address,about,pic,corporate_logo,company,fathername,mothername,parentcontactno,city,state,pincode, participantpic,participanturl,tshirtsize,aadhar_number,highestqualification, remark, type, 
            added_by, added_on, edited_by, edited_on, delete_flag, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?,?,?,?, ?,?,?,?,?,?,?,?,?,?,?)
        `;

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const registrationValues = [
            data.sid, data.name, data.email, hashedPassword, data.mobile, "", data.gender || '', "", "", "", "", "", "", "", "", "", "", "",
            data.participantpic || '', "", "", "", "", data.remark || '', data.type, data.added_by, timestamp,
            data.edited_by || 0, data.edited_on || timestamp, 0, 1
        ];

        const result = await connection.execute(insertRegistrationQuery, registrationValues);
        console.log(result);


        const insertUserDataQuery = `
            INSERT INTO user_data (participant_id, dob, address, about,company_logo_r,company_logo_s,company, fathername, mothername, parentcontactno, 
            city, state, pincode, tshirtsize, aadhar_number, highestqualification, addedby, addedon, deleteflag, status,editedon,editedby)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const userDataValues = [
            data.sid,
            data.dob || '',
            data.address || '',
            data.about || '',
            data.company_logo_r || '',
            data.company_logo_s || '',
            data.company || '',
            data.fathername || '',
            data.mothername || '',
            data.parentcontactno || '',
            data.city || '',
            data.state || '',
            data.pincode || '',
            data.tshirtsize || '',
            data.aadhar_number || '',
            data.highestqualification || '',
            data.added_by,
            timestamp,
            0,
            1,
            timestamp,
            data.sid
        ];

        await connection.execute(insertUserDataQuery, userDataValues);

        const slug = generateSlug(`${data.name}-${data.sid}`);
        const insertUrlQuery = `
            INSERT INTO manage_user_url (user_id, url, url_type, role, status, addedon, addedby, deleteflag,editedon,editedby)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const urlValues = [data.sid, slug, 'Profile', data.type, 1, timestamp, data.added_by, 0, timestamp, data.sid];
        await connection.execute(insertUrlQuery, urlValues);

        await connection.commit();
        return 1;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Update data
const updateData = async (data) => {
    const connection = await pool.getConnection();
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        await connection.beginTransaction();

        const updateRegistrationQuery = `
            UPDATE registrations SET name = ?, email = ?, password = ?, gender = ?, participantpic = ?, remark = ?, 
            type = ?, edited_by = ?, edited_on = ?, status = ? WHERE mobile = ? AND id=? AND sid=?
        `;

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const registrationValues = [
            data.name || '',
            data.email || '',
            hashedPassword,
            data.gender || '',
            data.participantpic || '',
            data.remark || '',
            data.type || '',
            data.sid,
            timestamp,
            data.status || 1,
            data.mobile || '',
            data.id,
            data.sid
        ];

        await connection.execute(updateRegistrationQuery, registrationValues);

        const updateUserDataQuery = `
            UPDATE user_data SET dob = ?, address = ?, about = ?, fathername = ?, mothername = ?, parentcontactno = ?, 
            city = ?, state = ?, pincode = ?, tshirtsize = ?, aadhar_number = ?, highestqualification = ?, 
            editedon = ?, status = ? WHERE participant_id = ?
        `;

        const userDataValues = [
            data.dob || '',
            data.address || '',
            data.about || '',
            data.fathername || '',
            data.mothername || '',
            data.parentcontactno || '',
            data.city || '',
            data.state || '',
            data.pincode || '',
            data.tshirtsize || '',
            data.aadhar_number || '',
            data.highestqualification || '',
            timestamp,
            data.status || 1,
            data.sid
        ];

        await connection.execute(updateUserDataQuery, userDataValues);

        const slug = generateSlug(`${data.name}-${data.sid}`);
        const updateUrlQuery = `
            UPDATE manage_user_url SET url = ?, url_type = ?, role = ?, status = ?, editedon = ?, editedby = ?
            WHERE user_id = ?
        `;
        const urlValues = [slug, 'Profile', data.type || '', data.status || 1, timestamp, data.sid || '', data.sid || ''];
        await connection.execute(updateUrlQuery, urlValues);

        await connection.commit();
        return 1;
    } catch (error) {
        await connection.rollback();
        console.error("Error during update:", error);
        throw error;
    } finally {
        connection.release();
    }
}
// find User By Email Or Mobile
const findUserByEmailOrMobile = async (email, mobile) => {
    try {
        const query = `SELECT * FROM registrations WHERE email = ? OR mobile = ? LIMIT 1`;
        const [rows] = await pool.execute(query, [email, mobile]);
        console.log(rows);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error finding user by email or mobile: ", error);
        throw error;
    }
}

const findUser = async (email="", mobile="", name="") => {
    try {
        const query = `SELECT * FROM registrations WHERE email = ? OR mobile = ? OR name=? LIMIT 1`;
        const [rows] = await pool.execute(query, [email, mobile, name]);
        console.log(rows);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error finding user by email or mobile: ", error);
        throw error;
    }
}

module.exports = { generateRandomNumber, insertData, updateData, findUserByEmailOrMobile, findUser };

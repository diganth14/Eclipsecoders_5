import os
import json
import pandas as pd
from datetime import datetime, timedelta
import streamlit as st
import hashlib

# -----------------------------
# Files and constants
# -----------------------------
DATA_FILE = 'resources.json'
WEIGHTS_FILE = 'weights.json'
USERS_FILE = 'users.json'
APP_DATA_DIR = '.'

# -----------------------------
# Safe load/save helpers
# -----------------------------
def load_data(file_path, default_obj):
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception:
        pass
    return default_obj

def save_data(file_path, data):
    tmp = file_path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp, file_path)

def hash_password(pwd):
    return hashlib.sha256(pwd.encode()).hexdigest()

# -----------------------------
# Default seed data
# -----------------------------
DEFAULT_RESOURCES = {
    'Grade 10': {
        'Math': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/playlist?list=PLjcFFdEpfDiVKUKSmePKM5R36KRiT_guB', 'topic': 'One Shot', 'difficulty': 'Hard'},
            {'type': 'pdf', 'link': 'https://ncert.nic.in/textbook/pdf/jemh101.pdf', 'topic': 'Algebra Notes', 'difficulty': 'Medium'}
        ],
        'Science': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=C2vZJ2iR3K0', 'topic': 'Force and Motion', 'difficulty': 'Easy'}
        ]
    },
    'Grade 11': {
        'Math': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=8W4y3mR9I7E', 'topic': 'Trigonometry', 'difficulty': 'Medium'}
        ],
        'Physics': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=tt2J2QBCf4I', 'topic': 'Kinematics', 'difficulty': 'Medium'}
        ]
    },
    'Grade 12': {
        'Math': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3gk_Li5kx4pJ7TSOYE2EQPQ', 'topic': 'Calculus Full Course', 'difficulty': 'Hard'}
        ],
        'Physics': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/playlist?list=PL2xF3HCNxGM-RzkDFuwLnYTiXSUvND_kX', 'topic': 'Electromagnetism', 'difficulty': 'Hard'}
        ],
        'Chemistry': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/playlist?list=PLDFtjdbvBWcZRN2GOwVFow4tMdeytVHjs', 'topic': 'Organic Chemistry', 'difficulty': 'Hard'}
        ]
    },
    'JEE': {
        'Math': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3gk_Li5kx4pJ7TSOYE2EQPQ', 'topic': 'JEE Math Complete', 'difficulty': 'Hard'},
            {'type': 'past_paper', 'link': 'https://jeeadv.ac.in/archive/papers/2023/Mathematics_Paper1.pdf', 'topic': 'JEE 2023 Paper', 'solution': 'https://allen.in/jee-advanced-2023-solutions'}
        ],
        'Physics': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3gvV4VbbP8pza7MtoJkGu6M', 'topic': 'Mechanics Full', 'difficulty': 'Medium'}
        ],
        'Chemistry': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/playlist?list=PLxyGaR3hEy3joVGFUCCKG5BIKBSBW5ihL', 'topic': 'Organic Chemistry', 'difficulty': 'Hard'}
        ]
    },
    'NEET': {
        'Physics': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=J8Q3xp4nilo&list=PL09mpasZIIN_XqXfVy1loUa8GZNw2YXbl', 'topic': 'NEET Physics', 'difficulty': 'Medium'}
        ],
        'Chemistry': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/playlist?list=PLVdpygJig6T3wj_BNF2qEYblfILx-FP0', 'topic': 'NEET Chemistry', 'difficulty': 'Hard'}
        ],
        'Biology': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/playlist?list=PLIC-lVcuSiEfsyaGue-S8Y5zxRphDoukD', 'topic': 'Cell Biology', 'difficulty': 'Medium'}
        ]
    },
    'ICSE': {
        'Math': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=56txPzMEBxE&list=PLQSy-dRpoxpgPnV4Ls-USymKwvMcAzPcV', 'topic': 'ICSE Math', 'difficulty': 'Medium'}
        ],
        'Physics': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=02ROhZz8H3E&list=PLhf4hr_x5XyRPWPGmVPKT7sOAyNMnBgwR', 'topic': 'ICSE Physics', 'difficulty': 'Medium'}
        ],
        'Chemistry': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=-Jo1Kcdm5o0&list=PLpvtzFaN0I1ki4NOh6oTmrcN-O6W088D_', 'topic': 'ICSE Chemistry', 'difficulty': 'Medium'}
        ],
        'Computer Science': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=-femzvEMtvk&list=PLZiHmCL7g2CjgbXPznLSYtG43DtNHPh5h', 'topic': 'Java Programming', 'difficulty': 'Medium'}
        ],
        'Biology': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=4ua4svHAOZs&list=PLpvtzFaN0I1mkfvpKlMzAuynYvYzRU8Sg', 'topic': 'ICSE Biology', 'difficulty': 'Medium'}
        ]
    },
    'CBSE': {
        'Math': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=cbse_math1', 'topic': 'CBSE Math', 'difficulty': 'Medium'}
        ],
        'Science': [
            {'type': 'youtube', 'link': 'https://www.youtube.com/watch?v=cbse_sci1', 'topic': 'CBSE Science', 'difficulty': 'Medium'}
        ]
    }
}

DEFAULT_WEIGHTS = {
    'JEE': {'Math': 35, 'Physics': 30, 'Chemistry': 35},
    'NEET': {'Biology': 50, 'Physics': 25, 'Chemistry': 25},
    'ICSE': {'Math': 25, 'Science': 25, 'English': 20, 'Social': 20, 'Language': 10},
    'CBSE': {'Math': 25, 'Science': 25, 'English': 20, 'Social': 20, 'Language': 10}
}

DEFAULT_USERS = {
    "admin": {"password": hash_password("admin123"), "role": "admin"},
    "student1": {"password": hash_password("pass123"), "role": "student"},
    "teacher1": {"password": hash_password("teach123"), "role": "teacher"}
}

# -----------------------------
# Load persisted data or defaults
# -----------------------------
os.makedirs(APP_DATA_DIR, exist_ok=True)
resources = load_data(os.path.join(APP_DATA_DIR, DATA_FILE), DEFAULT_RESOURCES)
weights = load_data(os.path.join(APP_DATA_DIR, WEIGHTS_FILE), DEFAULT_WEIGHTS)
users = load_data(os.path.join(APP_DATA_DIR, USERS_FILE), DEFAULT_USERS)

# -----------------------------
# Streamlit page and state
# -----------------------------
st.set_page_config(page_title="Learning Hub", layout="wide")
st.title("Personalized Learning Resources & Exam Planner")

# Initialize session state
if 'user' not in st.session_state:
    st.session_state.user = None
if 'role' not in st.session_state:
    st.session_state.role = None
if 'plan' not in st.session_state:
    st.session_state.plan = None
if 'quiz' not in st.session_state:
    st.session_state.quiz = None

# -----------------------------
# Login / Logout
# -----------------------------
def login(username, password):
    if username in users and users[username]["password"] == hash_password(password):
        st.session_state.user = username
        st.session_state.role = users[username]["role"]
        st.rerun()
    else:
        st.error("Invalid username or password")

def logout():
    st.session_state.user = None
    st.session_state.role = None
    st.rerun()

# Login UI
if st.session_state.user:
    st.sidebar.success(f"Logged in as: **{st.session_state.user}** ({st.session_state.role})")
    if st.sidebar.button("Logout"):
        logout()
else:
    st.sidebar.header("Login")
    with st.sidebar.form("login_form"):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        submit = st.form_submit_button("Login")
        if submit:
            login(username, password)

# -----------------------------
# Registration (Public)
# -----------------------------
if not st.session_state.user:
    st.sidebar.header("Create New Account")
    with st.sidebar.form("register_form"):
        new_username = st.text_input("New Username")
        new_password = st.text_input("New Password", type="password")
        confirm_password = st.text_input("Confirm Password", type="password")
        submit_reg = st.form_submit_button("Register")
        if submit_reg:
            if not new_username or not new_password:
                st.error("Username and password are required.")
            elif new_password != confirm_password:
                st.error("Passwords do not match.")
            elif new_username in users:
                st.error("Username already exists.")
            else:
                users[new_username] = {"password": hash_password(new_password), "role": "student"}
                save_data(os.path.join(APP_DATA_DIR, USERS_FILE), users)
                st.success(f"Account created! You can now log in as **{new_username}**.")
                st.rerun()

# -----------------------------
# Restrict access if not logged in
# -----------------------------
if not st.session_state.user:
    st.warning("Please log in or create an account to access the app.")
    st.stop()

# -----------------------------
# Tabs
# -----------------------------
tabs = ["Student Dashboard", "Generate Plan & Quiz", "Resources"]
if st.session_state.role in ["admin", "teacher"]:
    tabs.append("Admin Panel")

tab1, tab2, tab3, *admin_tabs = st.tabs(tabs)
admin_tab = admin_tabs[0] if admin_tabs else None

# -----------------------------
# Student Dashboard
# -----------------------------
with tab1:
    st.header("Select Grade and Exam")
    grade = st.selectbox("Grade", ["Grade 10", "Grade 11", "Grade 12"], key="dash_grade")
    if grade == "Grade 10":
        exam_options = ["ICSE", "CBSE"]
    elif grade in ["Grade 11", "Grade 12"]:
        exam_options = ["JEE", "NEET"]
    else:
        exam_options = list(weights.keys())

    exam = st.selectbox("Target Exam", exam_options, key="dash_exam")

    if grade and exam:
        st.subheader("Subject Weightages")
        wmap = weights.get(exam, {})
        if wmap:
            weight_df = pd.DataFrame(list(wmap.items()), columns=['Subject', 'Weightage %']).sort_values('Weightage %', ascending=False)
            st.dataframe(weight_df, use_container_width=True)
        else:
            st.info("No weightages found for the selected exam.")

# -----------------------------
# Generate Plan & Quiz
# -----------------------------
with tab2:
    st.header("AI Assistant")
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Generate Study Plan")
        days = st.slider("Study Days", 1, 30, 7, key="plan_days")
        if st.button("Generate Study Plan", key="gen_plan_btn"):
            sel_exam = st.session_state.get("dash_exam")
            subs = list(weights.get(sel_exam, {}).keys())
            if not subs:
                st.warning("No weightages found for selected exam. Ask admin to add them.")
            else:
                s1 = subs[0]
                s2 = subs[1] if len(subs) > 1 else subs[0]
                plan = {
                    "Start Date": datetime.now().strftime("%Y-%m-%d"),
                    "End Date": (datetime.now() + timedelta(days=days)).strftime("%Y-%m-%d"),
                    "Daily Schedule": {}
                }
                for i in range(days):
                    date = (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d")
                    plan["Daily Schedule"][date] = f"Focus on high weightage subjects: Review {s1} for 2hrs, practice {s2}"
                st.session_state.plan = plan
        if st.session_state.plan:
            st.json(st.session_state.plan)

    with col2:
        st.subheader("Generate Quiz")
        weak_topic = st.text_input("Enter Weak Topic (e.g., Calculus)", key="weak_topic")
        if st.button("Generate Quiz", key="gen_quiz_btn") and weak_topic.strip():
            qt = weak_topic.strip()
            quiz = {
                "Question 1": f"What is the derivative of x^2 in {qt}?",
                "Options": ["A) x^2", "B) 2x", "C) x", "D) 1"],
                "Answer": "B"
            }
            st.session_state.quiz = quiz
        if st.session_state.quiz:
            st.write("**Quiz:**")
            for q, opts in st.session_state.quiz.items():
                if q != "Answer":
                    st.write(q)
                    if isinstance(opts, list):
                        for opt in opts:
                            st.write(opt)
            st.write(f"**Answer: {st.session_state.quiz['Answer']}**")

# -----------------------------
# Resources
# -----------------------------
with tab3:
    st.header("Resources")
    res_grade = st.selectbox("Select Grade", ["Grade 10", "Grade 11", "Grade 12"], key="res_grade")
    if res_grade == "Grade 10":
        res_exam_options = ["ICSE", "CBSE"]
    elif res_grade in ["Grade 11", "Grade 12"]:
        res_exam_options = ["JEE", "NEET"]
    else:
        res_exam_options = list(weights.keys())
    res_exam = st.selectbox("Select Target Exam", res_exam_options, key="res_exam")

    if res_grade and res_exam:
        subjects = sorted(set(resources.get(res_grade, {}).keys()) | set(resources.get(res_exam, {}).keys()))
        if subjects:
            for subject in subjects:
                st.write(f"### {subject}")
                merged = (resources.get(res_grade, {}).get(subject, []) + resources.get(res_exam, {}).get(subject, []))
                seen = set()
                dedup = []
                for r in merged:
                    key = (r.get('type'), r.get('link'))
                    if key not in seen:
                        seen.add(key)
                        dedup.append(r)
                if dedup:
                    for res in dedup:
                        if res.get('type') == 'youtube':
                            st.video(res.get('link', ''))
                            st.caption(f"Topic: {res.get('topic','')} | Difficulty: {res.get('difficulty', 'N/A')}")
                        else:
                            topic = res.get('topic', 'Resource')
                            diff = res.get('difficulty', 'N/A')
                            link = res.get('link', '')
                            if link:
                                st.markdown(f"[{topic} ({diff})]({link})")
                            if 'solution' in res and res.get('solution'):
                                st.markdown(f"[View Solution]({res['solution']})")
                else:
                    st.info(f"No resources available for {subject}")
        else:
            st.info("No subjects available for the selected grade and exam")

# -----------------------------
# Admin Panel (Only for admin/teacher)
# -----------------------------
if admin_tab and st.session_state.role in ["admin", "teacher"]:
    with admin_tab:
        st.header("Admin: Add Resources")

        st.subheader("Add New Resource")
        colA, colB = st.columns(2)
        with colA:
            subject = st.text_input("Subject", key="res_subject")
            exam_grade = st.selectbox("Exam/Grade", list(resources.keys()) + ["New"], key="res_exam_grade")
            new_eg = ""
            if exam_grade == "New":
                new_eg = st.text_input("New Exam/Grade Name", key="new_exam_grade_name")
        with colB:
            res_type = st.selectbox("Type", ["youtube", "pdf", "past_paper"], key="res_type")
            link = st.text_input("Link", key="res_link")
            topic = st.text_input("Topic", key="res_topic")
            difficulty = st.selectbox("Difficulty", ["Easy", "Medium", "Hard"], key="res_diff")

        if st.button("Add Resource", key="add_res_btn"):
            target_eg = new_eg.strip() if exam_grade == "New" else exam_grade
            if not (subject and target_eg and link and topic):
                st.error("Please fill all required fields.")
            else:
                if target_eg not in resources:
                    resources[target_eg] = {}
                if subject not in resources[target_eg]:
                    resources[target_eg][subject] = []
                item = {'type': res_type, 'link': link, 'topic': topic, 'difficulty': difficulty}
                if res_type == "past_paper":
                    sol_link = st.text_input("Solution Link (optional)", key="sol_link")
                    if sol_link:
                        item['solution'] = sol_link
                resources[target_eg][subject].append(item)
                save_data(os.path.join(APP_DATA_DIR, DATA_FILE), resources)
                st.success("Resource Added!")
                st.rerun()

        st.subheader("Add Weightage")
        w_exam = st.text_input("Exam Name", key="w_exam")
        w_subject = st.text_input("Subject", key="w_subject")
        w_weight = st.number_input("Weightage %", 0, 100, key="w_weight")

        if st.button("Add Weightage", key="add_weight_btn"):
            if w_exam and w_subject:
                weights.setdefault(w_exam, {})
                weights[w_exam][w_subject] = int(w_weight)
                save_data(os.path.join(APP_DATA_DIR, WEIGHTS_FILE), weights)
                st.success("Weightage Added!")
                st.rerun()

        # User Management (Admin only)
        if st.session_state.role == "admin":
            st.subheader("User Management")
            new_user = st.text_input("New Username", key="admin_new_user")
            new_pass = st.text_input("New Password", type="password", key="admin_new_pass")
            new_role = st.selectbox("Role", ["student", "teacher", "admin"], key="admin_new_role")
            if st.button("Create User", key="admin_create_user"):
                if new_user and new_pass:
                    if new_user in users:
                        st.error("User already exists.")
                    else:
                        users[new_user] = {"password": hash_password(new_pass), "role": new_role}
                        save_data(os.path.join(APP_DATA_DIR, USERS_FILE), users)
                        st.success(f"User '{new_user}' created with role '{new_role}'.")
                        st.rerun()

st.markdown("---")
st.caption("Login or register to continue. Default: admin/admin123 | New users auto-registered as students.")
from bs4 import BeautifulSoup
import requests
import re

def load_html(url):
    try: 
        html_content = requests.get(url=url)
        return html_content.text
    except Exception as e:
        print(f"An error occurred: {str(e)}")

def get_student_data(url, year):
    result = {}
    try:
        html_content = load_html(url)
        year_text = year
        soup = BeautifulSoup(html_content, 'html.parser')
        column = soup.find('div', class_='ui four wide center aligned column')
        name_div = column.find('div', class_='ui big label black')
        name = name_div.text.strip()
        reg_no = None
        for sibling in name_div.next_siblings:
            if isinstance(sibling, str):
                text = sibling.strip()
                if text:
                    reg_no = text
                    break
        department = column.find('div', class_='ui large label').text.strip()
        year_match = re.search(r'(\d{4})', year_text)
        year_of_passing = year_match.group(1) if year_match else 'Not Found'

        result["name"] = name
        result["regno"] = reg_no
        result["Department"] = department
        result["Year of Passing"] = year_of_passing
        return result
    except Exception as e:
        print(f"An error occurred: {str(e)}")

# if __name__ =="__main__":
#     print(get_student_data("url"))
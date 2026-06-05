FROM python:3.10

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

# Install semua library AI kamu
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

# Jalankan Uvicorn di port 7860 khusus untuk Hugging Face
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
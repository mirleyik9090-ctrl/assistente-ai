from transformers import AutoModelForCausalLM, AutoTokenizer

class ChatbotModel:
    def __init__(self):
        # Load the Mistral 7B model
        self.tokenizer = AutoTokenizer.from_pretrained('mistral-models/mistral-7b')
        self.model = AutoModelForCausalLM.from_pretrained('mistral-models/mistral-7b')

    def generate_response(self, prompt):
        # Encode the prompt
        inputs = self.tokenizer(prompt, return_tensors='pt')
        # Generate response
        outputs = self.model.generate(**inputs)
        # Decode the response
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response

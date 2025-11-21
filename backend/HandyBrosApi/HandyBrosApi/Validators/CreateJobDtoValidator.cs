using FluentValidation;

namespace HandyBrosApi.Validators
{
    public class CreateJobDtoValidator : AbstractValidator<DTOs.CreateJobDto>
    {
        public CreateJobDtoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MinimumLength(5).WithMessage("Title too short");

            RuleFor(x => x.Body)
                .NotEmpty().WithMessage("Description is required")
                .MinimumLength(10).WithMessage("Description too short");
        }
    }
}
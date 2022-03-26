from setuptools import setup
import pathlib


here = pathlib.Path(__file__).parent.resolve()

long_description = (here / "README.md").read_text(encoding="utf-8")

setup(
    name="louriest",
    version="1.0.16",
    description="personal discord bot",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="yashodhanketkar",
    author_email="kykyashodhan@gmail.com",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apached 2.0 License ",
        "Programming Language :: Python :: 3.10",
    ],
    package_dir={"": "src/louriest"},
    python_requires=">=3.10, <4",
    install_requires=["discord", "google"],
    extras_require={
        "dev": ["black", "flake8"],
    },
)
